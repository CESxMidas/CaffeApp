import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import {
  BranchAssignmentStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
  StaffRole,
  TableStatus,
} from '@prisma/client';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';

const ids = {
  branch: '11111111-1111-1111-1111-111111111111',
  table: '22222222-2222-2222-2222-222222222222',
  product: '33333333-3333-3333-3333-333333333333',
  cashierUser: '44444444-4444-4444-4444-444444444444',
  cashierStaff: '55555555-5555-5555-5555-555555555555',
  baristaUser: '66666666-6666-6666-6666-666666666666',
  baristaStaff: '77777777-7777-7777-7777-777777777777',
};

type OrderRecord = {
  id: string;
  branchId: string;
  tableId: string | null;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  paidAt: Date | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    notes: string | null;
  }>;
};

class InMemoryPrisma {
  private users: any[] = [];
  private staffRows: any[] = [];
  private branches: any[] = [];
  private products: any[] = [];
  private tables: any[] = [];
  private orders: OrderRecord[] = [];
  private payments: any[] = [];
  private orderSeq = 1;
  private paymentSeq = 1;

  async seed() {
    const passwordHash = await bcrypt.hash('password123', 4);
    this.branches = [
      {
        id: ids.branch,
        name: 'Caffe Pilot',
        address: '1 Test Street',
        phone: '0900000000',
        isActive: true,
      },
    ];
    this.users = [
      {
        id: ids.cashierUser,
        email: 'cashier@caffe.app',
        passwordHash,
        fullName: 'Cashier One',
        isActive: true,
      },
      {
        id: ids.baristaUser,
        email: 'barista@caffe.app',
        passwordHash,
        fullName: 'Barista One',
        isActive: true,
      },
    ];
    this.staffRows = [
      {
        id: ids.cashierStaff,
        userId: ids.cashierUser,
        branchId: ids.branch,
        role: StaffRole.CASHIER,
        fullName: 'Cashier One',
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
      {
        id: ids.baristaStaff,
        userId: ids.baristaUser,
        branchId: ids.branch,
        role: StaffRole.BARISTA,
        fullName: 'Barista One',
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
    ];
    this.products = [
      {
        id: ids.product,
        branchId: ids.branch,
        name: 'Latte',
        price: 54000,
        isAvailable: true,
      },
    ];
    this.tables = [
      {
        id: ids.table,
        branchId: ids.branch,
        code: 'B-14',
        name: 'B-14',
        status: TableStatus.EMPTY,
      },
    ];
  }

  user = {
    findUnique: jest.fn(async ({ where, include }: any) => {
      const user = this.users.find((u) => u.id === where.id || u.email === where.email);
      if (!user) return null;
      if (include?.staff) {
        return { ...user, staff: this.staffRows.find((s) => s.userId === user.id) ?? null };
      }
      return { ...user };
    }),
  };

  staff = {
    findUnique: jest.fn(async ({ where, include }: any) => {
      const staff = this.staffRows.find((s) => s.id === where.id);
      if (!staff) return null;
      if (include?.user) {
        return { ...staff, user: this.users.find((u) => u.id === staff.userId) };
      }
      return { ...staff };
    }),
    findFirst: jest.fn(async ({ where }: any) => {
      return (
        this.staffRows.find((staff) => {
          if (where.id && staff.id !== where.id) return false;
          if (where.branchId && staff.branchId !== where.branchId) return false;
          if (where.isActive !== undefined && staff.isActive !== where.isActive) return false;
          if (
            where.branchAssignmentStatus &&
            staff.branchAssignmentStatus !== where.branchAssignmentStatus
          ) {
            return false;
          }
          if (where.role?.in && !where.role.in.includes(staff.role)) return false;
          return true;
        }) ?? null
      );
    }),
    findMany: jest.fn(async ({ where, select }: any) => {
      const rows = this.staffRows.filter((staff) => {
        if (where.branchId && staff.branchId !== where.branchId) return false;
        if (where.isActive !== undefined && staff.isActive !== where.isActive) return false;
        if (where.role?.in && !where.role.in.includes(staff.role)) return false;
        return true;
      });
      return select?.id
        ? rows.map((staff) => ({ id: staff.id }))
        : rows.map((staff) => ({ ...staff }));
    }),
  };

  branch = {
    findUnique: jest.fn(async ({ where }: any) => {
      const branch = this.branches.find((b) => b.id === where.id);
      return branch ? { ...branch } : null;
    }),
  };

  product = {
    findMany: jest.fn(async ({ where }: any) => {
      const wanted = new Set(where.id.in);
      return this.products.filter(
        (product) =>
          wanted.has(product.id) &&
          product.branchId === where.branchId &&
          product.isAvailable === where.isAvailable,
      );
    }),
  };

  table = {
    findFirst: jest.fn(async ({ where }: any) => {
      return (
        this.tables.find((table) => table.id === where.id && table.branchId === where.branchId) ??
        null
      );
    }),
    updateMany: jest.fn(async ({ where, data }: any) => {
      const table = this.tables.find(
        (row) =>
          row.id === where.id && row.branchId === where.branchId && row.status === where.status,
      );
      if (!table) return { count: 0 };
      Object.assign(table, data);
      return { count: 1 };
    }),
    update: jest.fn(async ({ where, data }: any) => {
      const table = this.tables.find((row) => row.id === where.id);
      if (!table) throw new Error('Table not found');
      Object.assign(table, data);
      return { ...table };
    }),
  };

  order = {
    count: jest.fn(async ({ where }: any) => {
      return this.orders.filter((order) => {
        if (where.branchId && order.branchId !== where.branchId) return false;
        if (where.tableId && order.tableId !== where.tableId) return false;
        if (where.createdAt?.gte && order.createdAt < where.createdAt.gte) return false;
        if (where.status?.notIn && where.status.notIn.includes(order.status)) return false;
        return true;
      }).length;
    }),
    create: jest.fn(async ({ data }: any) => {
      const now = new Date();
      const order: OrderRecord = {
        id: `88888888-8888-8888-8888-${String(this.orderSeq++).padStart(12, '0')}`,
        branchId: data.branchId,
        tableId: data.tableId,
        orderNumber: data.orderNumber,
        orderType: data.orderType,
        status: data.status,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        total: data.total,
        notes: data.notes,
        createdAt: now,
        updatedAt: now,
        deliveredAt: null,
        paidAt: null,
        items: data.items.create.map((item: any, index: number) => ({
          id: `99999999-9999-9999-9999-${String(index + 1).padStart(12, '0')}`,
          ...item,
        })),
      };
      this.orders.push(order);
      return { ...order, items: order.items.map((item) => ({ ...item })) };
    }),
    findUnique: jest.fn(async ({ where }: any) => {
      const order = this.orders.find((row) => row.id === where.id);
      return order
        ? { ...order, items: order.items.map((item) => ({ ...item })), payments: [] }
        : null;
    }),
    update: jest.fn(async ({ where, data }: any) => {
      const order = this.orders.find((row) => row.id === where.id);
      if (!order) throw new Error('Order not found');
      Object.assign(order, data, { updatedAt: new Date() });
      return { ...order, items: order.items.map((item) => ({ ...item })) };
    }),
  };

  payment = {
    create: jest.fn(async ({ data }: any) => {
      const payment = {
        id: `aaaaaaaa-aaaa-aaaa-aaaa-${String(this.paymentSeq++).padStart(12, '0')}`,
        orderId: data.orderId,
        method: data.method,
        amount: data.amount,
        changeAmount: data.changeAmount,
        reference: data.reference,
        paidAt: data.paidAt,
      };
      this.payments.push(payment);
      return { ...payment };
    }),
  };

  auditLog = {
    create: jest.fn(async () => ({})),
  };

  notification = {
    createMany: jest.fn(async () => ({ count: 1 })),
  };

  $transaction = jest.fn(async (callback: (tx: InMemoryPrisma) => Promise<unknown>) =>
    callback(this),
  );
}

describe('API auth, order, and payment flows', () => {
  let app: INestApplication;
  let prisma: InMemoryPrisma;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/caffeapp_test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    prisma = new InMemoryPrisma();
    await prisma.seed();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(email: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password123' })
      .expect(200);

    expect(response.body.data.accessToken).toEqual(expect.any(String));
    return response.body.data.accessToken as string;
  }

  async function createReadyDeliveredOrder(cashierToken: string, baristaToken: string) {
    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const orderId = created.body.data.id;
    expect(created.body.data.status).toBe(OrderStatus.PENDING);

    const making = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ status: OrderStatus.MAKING })
      .expect(200);
    expect(making.body.data.status).toBe(OrderStatus.MAKING);

    const ready = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${baristaToken}`)
      .send({ status: OrderStatus.READY })
      .expect(200);
    expect(ready.body.data.status).toBe(OrderStatus.READY);

    const delivered = await request(app.getHttpServer())
      .post(`/orders/${orderId}/deliver`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({})
      .expect(201);
    expect(delivered.body.data.status).toBe(OrderStatus.READY);
    expect(delivered.body.data.deliveredAt).toEqual(expect.any(String));

    return orderId as string;
  }

  it('logs in and returns the current user from /auth/me', async () => {
    const token = await login('cashier@caffe.app');

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.data.user.email).toBe('cashier@caffe.app');
    expect(me.body.data.staff.role).toBe(StaffRole.CASHIER);
    expect(me.body.data.branch.id).toBe(ids.branch);
  });

  it('runs the order lifecycle without SERVING', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const fetched = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(fetched.body.data.status).toBe(OrderStatus.READY);
    expect(fetched.body.data.status).not.toBe('SERVING');
    expect(Object.values(OrderStatus)).not.toContain('SERVING');
  });

  it('locks table B-14 after a dine-in order is sent to the kitchen', async () => {
    const cashierToken = await login('cashier@caffe.app');

    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        notes: 'B-14 lock check',
        items: [
          {
            productId: ids.product,
            quantity: 1,
            unitPrice: 54000,
            notes: 'Size M, Đường Ít, Đá Ít',
          },
        ],
      })
      .expect(201);

    expect(created.body.data).toMatchObject({
      tableId: ids.table,
      orderType: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      notes: 'B-14 lock check',
    });
    expect(created.body.data.items[0].notes).toBe('Size M, Đường Ít, Đá Ít');

    const conflict = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(409);

    expect(conflict.body.message).toEqual(expect.stringContaining('Bàn'));
  });

  it('accepts CASH payment and returns change', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const payment = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ orderId, method: PaymentMethod.CASH, amount: 60000 })
      .expect(201);

    expect(payment.body.data).toMatchObject({
      orderId,
      method: PaymentMethod.CASH,
      amount: 60000,
      changeAmount: 6000,
    });
  });

  it('accepts BANK_TRANSFER payment with a manual reference', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const payment = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        orderId,
        method: PaymentMethod.BANK_TRANSFER,
        amount: 54000,
        reference: 'VCB-MANUAL-001',
      })
      .expect(201);

    expect(payment.body.data).toMatchObject({
      orderId,
      method: PaymentMethod.BANK_TRANSFER,
      amount: 54000,
      changeAmount: null,
      reference: 'VCB-MANUAL-001',
    });
  });
});
