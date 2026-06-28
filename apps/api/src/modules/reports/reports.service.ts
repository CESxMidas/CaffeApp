import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
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

    const paidOrders = await this.prisma.order.findMany({
      where: {
        branchId,
        status: OrderStatus.PAID,
        paidAt: { gte: from, lte: to },
      },
      select: { total: true, paidAt: true, orderType: true },
    });

    const cancelledCount = await this.prisma.order.count({
      where: {
        branchId,
        status: OrderStatus.CANCELLED,
        updatedAt: { gte: from, lte: to },
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

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        cancelledOrders: cancelledCount,
        guestCount,
      },
      series,
    };
  }
}
