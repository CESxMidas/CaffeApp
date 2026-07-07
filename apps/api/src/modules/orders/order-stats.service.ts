import { Injectable } from '@nestjs/common';
import type { OrderDto } from '@caffeapp/shared';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import { groupBy } from '@common/utils/group-by.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { toOrderDto } from './order.mapper';
import type { OrderStatsDto } from './dto/order-stats.dto';
import type { TableOrdersDto } from './dto/table-orders.dto';

@Injectable()
export class OrderStatsService {
  constructor(private readonly prisma: PrismaService) {}

  // FR-D02: GET /orders/stats/hourly (revenue by hour)
  async getHourlyStats(
    payload: JwtPayload,
    branchId?: string,
    date?: string,
  ): Promise<{ hour: number; revenue: number; orders: number }[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let start: Date;
    let end: Date;
    if (date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(end.getDate() + 1);
    }

    // Get PAID orders for the day
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: OrderStatus.PAID,
        createdAt: { gte: start, lt: end },
      },
      select: {
        total: true,
        createdAt: true,
      },
    });

    // Group by hour
    const hourlyMap = groupBy(
      orders,
      (order) => order.createdAt.getHours(),
      () => ({ revenue: 0, orders: 0 }),
      (acc, order) => {
        acc.revenue += order.total;
        acc.orders++;
      },
    );

    // Convert to array covering all 24 hours, sorted by hour
    return Array.from({ length: 24 }, (_, hour) => {
      const data = hourlyMap.get(hour) ?? { revenue: 0, orders: 0 };
      return { hour, revenue: data.revenue, orders: data.orders };
    });
  }

  // Task 8.2: GET /orders/stats (statistics)
  async getStats(payload: JwtPayload, branchId?: string, date?: string): Promise<OrderStatsDto> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      dateFilter = { createdAt: { gte: start, lt: end } };
    }

    // Get orders with status counts
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        ...dateFilter,
      },
      select: {
        status: true,
        total: true,
      },
    });

    // Calculate stats by status
    const statusMap = groupBy(
      orders,
      (order) => order.status,
      () => ({ count: 0, revenue: 0 }),
      (acc, order) => {
        acc.count++;
        if (order.status === OrderStatus.PAID) {
          acc.revenue += order.total;
        }
      },
    );

    const ALL_STATUSES = [
      OrderStatus.PENDING,
      OrderStatus.MAKING,
      OrderStatus.READY,
      OrderStatus.PAID,
      OrderStatus.CANCELLED,
    ];
    const statusCounts = Object.fromEntries(
      ALL_STATUSES.map((status) => [status, statusMap.get(status) ?? { count: 0, revenue: 0 }]),
    ) as Record<OrderStatus, { count: number; revenue: number }>;

    const totalRevenue = statusCounts[OrderStatus.PAID].revenue;
    const totalOrders = orders.length;
    const paidOrders = statusCounts[OrderStatus.PAID].count;

    return {
      summary: {
        totalOrders,
        pendingOrders: statusCounts[OrderStatus.PENDING].count,
        makingOrders: statusCounts[OrderStatus.MAKING].count,
        readyOrders: statusCounts[OrderStatus.READY].count,
        deliveredOrders: 0, // deprecated - no longer tracked separately
        paidOrders,
        cancelledOrders: statusCounts[OrderStatus.CANCELLED].count,
        totalRevenue,
        averageOrderValue: paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,
      },
      byStatus: Object.entries(statusCounts).map(([status, data]) => ({
        status,
        count: data.count,
        revenue: data.revenue,
      })),
    };
  }

  // Task 12.1: GET /orders/my-tables (cashier view - orders grouped by table)
  async getOrdersByTables(payload: JwtPayload, branchId?: string): Promise<TableOrdersDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Get all tables in branch
    const tables = await this.prisma.table.findMany({
      where: { branchId: scopedBranchId },
      orderBy: [{ floor: 'asc' }, { code: 'asc' }],
    });

    // Get active orders (not PAID or CANCELLED)
    const activeOrders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: { notIn: [OrderStatus.PAID, OrderStatus.CANCELLED] },
        tableId: { not: null },
      },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group orders by table
    const tableMap = new Map<string, TableOrdersDto>();

    // Initialize all tables
    for (const table of tables) {
      tableMap.set(table.id, {
        tableId: table.id,
        tableCode: table.code,
        tableFloor: table.floor,
        orders: [],
        totalAmount: 0,
        activeOrderCount: 0,
      });
    }

    // Add orders to tables
    for (const order of activeOrders) {
      if (!order.tableId) continue;

      const tableData = tableMap.get(order.tableId);
      if (tableData) {
        tableData.orders.push(toOrderDto(order));
        tableData.totalAmount += order.total;
        tableData.activeOrderCount++;
      }
    }

    // Return only tables with orders or all tables
    return Array.from(tableMap.values());
  }

  // Task 12.2: GET /orders/history (order history with date filters)
  async getHistory(
    payload: JwtPayload,
    branchId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<OrderDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { gte: start, lte: end } };
    } else if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { gte: start } };
    } else if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { lte: end } };
    }

    // Get completed orders (PAID, CANCELLED)
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: scopedBranchId,
        status: { in: [OrderStatus.PAID, OrderStatus.CANCELLED] },
        ...dateFilter,
      },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return orders.map((o) => toOrderDto(o));
  }
}
