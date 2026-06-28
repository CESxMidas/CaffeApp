import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PaymentDto } from '@caffeapp/shared';
import { OrderStatus, PaymentMethod, StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { assertBranchAccess } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: JwtPayload, dto: CreatePaymentDto): Promise<PaymentDto> {
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

    const canEarlyPay =
      payload.role === StaffRole.MANAGER || payload.role === StaffRole.OWNER;
    if (order.status !== OrderStatus.SERVING && !canEarlyPay) {
      throw new BadRequestException('Đơn chưa giao nước — xác nhận "Đã giao nước" trước khi thanh toán');
    }
    if (
      canEarlyPay &&
      order.status !== OrderStatus.SERVING &&
      order.status !== OrderStatus.READY
    ) {
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
