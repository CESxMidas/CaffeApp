import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import { groupBy } from '@common/utils/group-by.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { RevenueReportQueryDto } from './dto/revenue-report-query.dto';

export interface RevenueReportDto {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    cancelledOrders: number;
    guestCount: number;
  };
  series: Array<{ period: string; revenue: number; orders: number }>;
  byPaymentMethod: Array<{ method: PaymentMethod; revenue: number; orders: number }>;
  topItems: Array<{ productId: string; productName: string; quantity: number; revenue: number }>;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRevenue(payload: JwtPayload, query: RevenueReportQueryDto): Promise<RevenueReportDto> {
    const branchId = resolveBranchScope(payload, query.branchId);
    const from = new Date(query.from);
    const to = new Date(query.to);
    to.setHours(23, 59, 59, 999);

    if (from > to) {
      throw new BadRequestException('from phải nhỏ hơn hoặc bằng to');
    }

    const paidOrderScope = query.shiftId
      ? { branchId, shiftId: query.shiftId }
      : { branchId, paidAt: { gte: from, lte: to } };
    const cancelledOrderScope = query.shiftId
      ? { branchId, shiftId: query.shiftId }
      : { branchId, updatedAt: { gte: from, lte: to } };

    const paidOrders = await this.prisma.order.findMany({
      where: {
        ...paidOrderScope,
        status: OrderStatus.PAID,
      },
      select: {
        id: true,
        total: true,
        paidAt: true,
        orderType: true,
        items: { select: { productId: true, productName: true, quantity: true, lineTotal: true } },
      },
    });

    const cancelledCount = await this.prisma.order.count({
      where: {
        ...cancelledOrderScope,
        status: OrderStatus.CANCELLED,
      },
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = paidOrders.length;
    const guestCount = paidOrders.filter((o) => o.orderType === 'DINE_IN').length;

    const seriesMap = groupBy(
      paidOrders,
      (order) => (order.paidAt ?? from).toISOString().slice(0, 10),
      () => ({ revenue: 0, orders: 0 }),
      (acc, order) => {
        acc.revenue += order.total;
        acc.orders += 1;
      },
    );

    const series = Array.from(seriesMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, stats]) => ({ period, ...stats }));

    // Breakdown by payment method
    const payments = await this.prisma.payment.findMany({
      where: {
        order: { ...paidOrderScope, status: OrderStatus.PAID },
      },
      select: { method: true, amount: true, orderId: true },
    });

    const paymentMap = groupBy(
      payments,
      (p) => p.method,
      () => ({ revenue: 0, orders: new Set<string>() }),
      (acc, p) => {
        acc.revenue += p.amount;
        acc.orders.add(p.orderId);
      },
    );

    const byPaymentMethod = Array.from(paymentMap.entries()).map(([method, data]) => ({
      method,
      revenue: data.revenue,
      orders: data.orders.size,
    }));

    // Top selling items
    const orderItems = paidOrders.flatMap((order) => order.items);
    const itemMap = groupBy(
      orderItems,
      (item) => item.productId,
      () => ({ productName: '', quantity: 0, revenue: 0 }),
      (acc, item) => {
        acc.productName = item.productName;
        acc.quantity += item.quantity;
        acc.revenue += item.lineTotal;
      },
    );

    const topItems = Array.from(itemMap.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        cancelledOrders: cancelledCount,
        guestCount,
      },
      series,
      byPaymentMethod,
      topItems,
    };
  }
}
