import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {
  BranchAssignmentStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
  type Prisma,
  StaffRole,
} from '@prisma/client';
import { StaffRole as SharedStaffRole } from '@caffeapp/shared';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import { AuditService } from '../../src/common/audit/audit.service';
import { ActorResolverService } from '../../src/common/audit/actor-resolver.service';
import { PaymentsService } from '../../src/modules/payments/payments.service';
import type { JwtPayload } from '../../src/common/types/jwt-payload.types';

/**
 * REAL PostgreSQL concurrency test for payment creation.
 *
 * Uses the production PaymentsService, real PrismaService, real transactions and
 * a real database. Two concurrent create() calls are synchronised with a
 * DETERMINISTIC barrier (no sleeps / timing races): both are held until both have
 * read the order in READY state, then released together. On the fixed service
 * exactly one payment is created; on the old (unconditional update) service both
 * would have committed a payment for the same order.
 */

// Namespaced, valid-UUID fixtures so cleanup is precise.
const BRANCH_ID = 'cc000000-0000-4000-8000-0000000000a1';
const USER_ID = 'cc000000-0000-4000-8000-0000000000a2';
const STAFF_ID = 'cc000000-0000-4000-8000-0000000000a3';
const ORDER_ID = 'cc000000-0000-4000-8000-0000000000a4';
const ORDER_TOTAL = 100000;

const payload: JwtPayload = {
  sub: USER_ID,
  staffId: STAFF_ID,
  email: 'cashier-p0@test.local',
  role: SharedStaffRole.CASHIER,
  branchId: BRANCH_ID,
  type: 'access',
};

/** Deterministic N-party barrier with a safety timeout (never hangs forever). */
function createBarrier(parties: number, timeoutMs: number) {
  let arrived = 0;
  let release!: () => void;
  let fail!: (err: Error) => void;
  const gate = new Promise<void>((resolve, reject) => {
    release = resolve;
    fail = reject;
  });
  const timer = setTimeout(
    () => fail(new Error(`barrier timed out waiting for ${parties} parties`)),
    timeoutMs,
  );
  return {
    async wait(): Promise<void> {
      arrived += 1;
      if (arrived >= parties) {
        clearTimeout(timer);
        release();
      }
      await gate;
    },
  };
}

async function cleanup(prisma: PrismaService): Promise<void> {
  await prisma.payment.deleteMany({ where: { orderId: ORDER_ID } });
  await prisma.auditLog.deleteMany({ where: { branchId: BRANCH_ID } });
  await prisma.order.deleteMany({ where: { id: ORDER_ID } });
  await prisma.staff.deleteMany({ where: { id: STAFF_ID } });
  await prisma.user.deleteMany({ where: { id: USER_ID } });
  await prisma.branch.deleteMany({ where: { id: BRANCH_ID } });
}

async function seed(prisma: PrismaService): Promise<void> {
  await prisma.branch.create({ data: { id: BRANCH_ID, name: 'P0 Concurrency Branch' } });
  await prisma.user.create({
    data: { id: USER_ID, email: payload.email, fullName: 'P0 Cashier', passwordHash: 'x' },
  });
  await prisma.staff.create({
    data: {
      id: STAFF_ID,
      userId: USER_ID,
      branchId: BRANCH_ID,
      role: StaffRole.CASHIER,
      fullName: 'P0 Cashier',
      isActive: true,
      branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    },
  });
}

async function resetOrderToReady(prisma: PrismaService): Promise<void> {
  await prisma.payment.deleteMany({ where: { orderId: ORDER_ID } });
  await prisma.order.deleteMany({ where: { id: ORDER_ID } });
  await prisma.order.create({
    data: {
      id: ORDER_ID,
      branchId: BRANCH_ID,
      orderNumber: 'P0-001',
      orderType: OrderType.TAKE_AWAY,
      status: OrderStatus.READY,
      subtotal: ORDER_TOTAL,
      taxAmount: 0,
      total: ORDER_TOTAL,
      deliveredAt: new Date(),
    },
  });
}

describe('Payment concurrency (real PostgreSQL)', () => {
  let prisma: PrismaService;
  let payments: PaymentsService;
  let audit: AuditService;
  let auditSpy: ReturnType<typeof jest.spyOn>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, AuditService, ActorResolverService, PaymentsService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    payments = moduleRef.get(PaymentsService);
    audit = moduleRef.get(AuditService);

    await prisma.$connect();
    await cleanup(prisma);
    await seed(prisma);
  });

  afterAll(async () => {
    if (prisma) {
      await cleanup(prisma);
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    await resetOrderToReady(prisma);
    // Count invocations deterministically without depending on the fire-and-forget
    // audit write landing in the DB (the audit call is intentionally left outside
    // the payment transaction in this phase).
    auditSpy = jest.spyOn(audit, 'log').mockResolvedValue(undefined);
  });

  afterEach(() => {
    auditSpy.mockRestore();
  });

  it('creates exactly one payment when two requests race the same READY order', async () => {
    const barrier = createBarrier(2, 10_000);
    const realFindUnique = prisma.order.findUnique.bind(prisma.order);
    const findUniqueSpy = jest.spyOn(prisma.order, 'findUnique').mockImplementation((async (
      args: Prisma.OrderFindUniqueArgs,
    ) => {
      const result = await realFindUnique(args);
      // Hold both callers only after each has read the order as READY.
      if (args.where?.id === ORDER_ID) {
        await barrier.wait();
      }
      return result;
    }) as unknown as typeof prisma.order.findUnique);

    const dto = { orderId: ORDER_ID, method: PaymentMethod.CASH, amount: ORDER_TOTAL };

    const results = await Promise.allSettled([
      payments.create(payload, dto),
      payments.create(payload, dto),
    ]);

    findUniqueSpy.mockRestore();

    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');

    // Exactly one winner, one loser.
    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].reason).toBeInstanceOf(ConflictException);
    expect((rejected[0].reason as ConflictException).message).toBe('Đơn đã thanh toán');
    expect((rejected[0].reason as ConflictException).getStatus()).toBe(409);

    // Database has exactly one payment; total is not double-counted.
    const rows = await prisma.payment.findMany({ where: { orderId: ORDER_ID } });
    expect(rows).toHaveLength(1);
    expect(rows.reduce((sum, p) => sum + p.amount, 0)).toBe(ORDER_TOTAL);

    const order = await prisma.order.findUnique({ where: { id: ORDER_ID } });
    expect(order?.status).toBe(OrderStatus.PAID);
    expect(order?.paidAt).toBeInstanceOf(Date);

    // Only the winning transaction logs a payment.created audit entry.
    expect(auditSpy).toHaveBeenCalledTimes(1);
    expect(auditSpy.mock.calls[0][0]).toMatchObject({ action: 'payment.created' });
  });

  it('rejects a retry after the order is already PAID without creating a second payment', async () => {
    const dto = { orderId: ORDER_ID, method: PaymentMethod.CASH, amount: ORDER_TOTAL };

    await payments.create(payload, dto);
    expect(auditSpy).toHaveBeenCalledTimes(1);

    await expect(payments.create(payload, dto)).rejects.toMatchObject({
      message: 'Đơn đã thanh toán',
    });

    const rows = await prisma.payment.findMany({ where: { orderId: ORDER_ID } });
    expect(rows).toHaveLength(1);
    // No extra payment.created audit for the rejected retry.
    expect(auditSpy).toHaveBeenCalledTimes(1);
  });

  it('supports void then re-payment, leaving exactly one current payment', async () => {
    const dto = { orderId: ORDER_ID, method: PaymentMethod.CASH, amount: ORDER_TOTAL };

    const first = await payments.create(payload, dto);
    await payments.void(payload, first.id, { reason: 'P0 test void' });

    const afterVoid = await prisma.order.findUnique({ where: { id: ORDER_ID } });
    expect(afterVoid?.status).toBe(OrderStatus.READY);
    expect(await prisma.payment.count({ where: { orderId: ORDER_ID } })).toBe(0);

    await payments.create(payload, dto);

    const rows = await prisma.payment.findMany({ where: { orderId: ORDER_ID } });
    expect(rows).toHaveLength(1);
    const order = await prisma.order.findUnique({ where: { id: ORDER_ID } });
    expect(order?.status).toBe(OrderStatus.PAID);
  });
});
