import { BadRequestException, ConflictException } from '@nestjs/common';
import { OrderStatus, StaffRole } from '@prisma/client';
import type { PrismaService } from '@common/prisma/prisma.service';
import { ACTIVE_ORDER_STATUSES } from './orders.constants';
import type { OrderWithItemsAndPayments } from './orders.types';

export function assertOrderCanBeRebilled(order: OrderWithItemsAndPayments): void {
  if (!ACTIVE_ORDER_STATUSES.includes(order.status)) {
    throw new ConflictException('Chỉ xử lý bill cho đơn chưa thanh toán hoặc chưa hủy');
  }
  if (order.payments?.length) {
    throw new ConflictException('Đơn đã có giao dịch thanh toán, không thể đổi bill');
  }
}

export function assertStatusRole(role: StaffRole, from: OrderStatus, to: OrderStatus): void {
  if (to === OrderStatus.CANCELLED) {
    if (from === OrderStatus.READY) {
      if (role !== StaffRole.MANAGER && role !== StaffRole.OWNER) {
        throw new BadRequestException('Chỉ quản lý mới hủy đơn đã sẵn sàng');
      }
    }
    return;
  }

  if (to === OrderStatus.MAKING) {
    return;
  }

  if (to === OrderStatus.READY) {
    if (role !== StaffRole.BARISTA && role !== StaffRole.MANAGER && role !== StaffRole.OWNER) {
      throw new BadRequestException('Chỉ barista mới đánh dấu hoàn thành pha');
    }
  }
}

export async function nextOrderNumber(prisma: PrismaService, branchId: string): Promise<string> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const count = await prisma.order.count({
    where: { branchId, createdAt: { gte: start } },
  });
  const date = start.toISOString().slice(0, 10).replace(/-/g, '');
  return `${date}-${String(count + 1).padStart(3, '0')}`;
}
