import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PaymentDto } from '@caffeapp/shared';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { ActorResolverService } from '@common/audit/actor-resolver.service';
import { AuditService } from '@common/audit/audit.service';
import { assertBranchAccess } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { CreatePaymentDto } from './dto/create-payment.dto';

const PILOT_PAYMENT_METHODS = new Set<PaymentMethod>([
  PaymentMethod.CASH,
  PaymentMethod.BANK_TRANSFER,
]);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly actorResolver: ActorResolverService,
  ) {}

  async create(payload: JwtPayload, dto: CreatePaymentDto): Promise<PaymentDto> {
    if (!PILOT_PAYMENT_METHODS.has(dto.method)) {
      throw new BadRequestException('Pilot chỉ hỗ trợ tiền mặt hoặc chuyển khoản');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);

    if (order.status === OrderStatus.PAID) {
      throw new ConflictException('Đơn đã thanh toán');
    }

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Đơn chưa sẵn sàng để thanh toán');
    }

    if (dto.amount < order.total) {
      throw new BadRequestException('Số tiền không đủ');
    }

    let changeAmount: number | null = null;
    if (dto.method === PaymentMethod.CASH) {
      changeAmount = dto.amount - order.total;
      if (changeAmount < 0) {
        throw new BadRequestException('Số tiền không đủ');
      }
    } else if (dto.changeAmount && dto.changeAmount > 0) {
      throw new BadRequestException('Tiền thừa chỉ áp dụng cho tiền mặt');
    }

    const paidAt = new Date();
    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          orderId: order.id,
          method: dto.method,
          amount: dto.amount,
          changeAmount,
          reference: dto.reference ?? null,
          paidAt,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID, paidAt },
      });

      if (order.tableId) {
        await syncTableEmptyIfIdle(tx, order.tableId);
      }

      return created;
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'payment',
      entityId: payment.id,
      action: 'payment.created',
      afterData: {
        orderId: order.id,
        method: payment.method,
        amount: payment.amount,
      },
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as import('@prisma/client').Prisma.InputJsonValue)
        : undefined,
    });

    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method as PaymentDto['method'],
      amount: payment.amount,
      changeAmount: payment.changeAmount,
      reference: payment.reference,
      paidAt: payment.paidAt.toISOString(),
    };
  }
}
