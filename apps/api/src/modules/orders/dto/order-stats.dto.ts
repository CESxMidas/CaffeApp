export interface OrderStatsDto {
  summary: {
    totalOrders: number;
    pendingOrders: number;
    makingOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    paidOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
}
