import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
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

    const seriesMap = new Map<string, { revenue: number; orders: number }>();
    for (const order of paidOrders) {
      const period = (order.paidAt ?? from).toISOString().slice(0, 10);
      const entry = seriesMap.get(period) ?? { revenue: 0, orders: 0 };
      entry.revenue += order.total;
      entry.orders += 1;
      seriesMap.set(period, entry);
    }

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

    const paymentMap = new Map<PaymentMethod, { revenue: number; orders: Set<string> }>();
    for (const p of payments) {
      const entry = paymentMap.get(p.method) ?? { revenue: 0, orders: new Set<string>() };
      entry.revenue += p.amount;
      entry.orders.add(p.orderId);
      paymentMap.set(p.method, entry);
    }

    const byPaymentMethod = Array.from(paymentMap.entries()).map(([method, data]) => ({
      method,
      revenue: data.revenue,
      orders: data.orders.size,
    }));

    // Top selling items
    const itemMap = new Map<string, { productName: string; quantity: number; revenue: number }>();
    for (const order of paidOrders) {
      for (const item of order.items) {
        const entry = itemMap.get(item.productId) ?? {
          productName: item.productName,
          quantity: 0,
          revenue: 0,
        };
        entry.quantity += item.quantity;
        entry.revenue += item.lineTotal;
        itemMap.set(item.productId, entry);
      }
    }

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
