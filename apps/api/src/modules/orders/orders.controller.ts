import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { OrderDto, SplitOrderResponseDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliverOrderDto } from './dto/deliver-order.dto';
import { MergeOrdersDto } from './dto/merge-orders.dto';
import { SplitOrderDto } from './dto/split-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatsDto } from './dto/order-stats.dto';
import { TableOrdersDto } from './dto/table-orders.dto';
import { ToggleItemPreparedDto } from './dto/toggle-item-prepared.dto';
import { TransferOrderTableDto } from './dto/transfer-order-table.dto';
import { OrdersService } from './orders.service';
import { OrderBillingService } from './order-billing.service';
import { OrderStatsService } from './order-stats.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderBillingService: OrderBillingService,
    private readonly orderStatsService: OrderStatsService,
  ) {}

  @Get()
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('tableId') tableId?: string,
    @Query('deliveryState') deliveryState?: 'awaiting_delivery' | 'awaiting_payment',
  ): Promise<{ data: OrderDto[] }> {
    const data = await this.ordersService.listForBranch(
      user,
      branchId,
      status,
      tableId,
      deliveryState,
    );
    return { data };
  }

  // Task 8.1: GET /orders/queue (barista queue)
  @Get('queue')
  @Roles(StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async queue(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: OrderDto[] }> {
    const data = await this.ordersService.getQueue(user, branchId);
    return { data };
  }

  // Task 8.2: GET /orders/stats (statistics)
  @Get('stats/summary')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async stats(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
    @Query('date') date?: string,
  ): Promise<{ data: OrderStatsDto }> {
    const data = await this.orderStatsService.getStats(user, branchId, date);
    return { data };
  }

  // FR-D02: GET /orders/stats/hourly (revenue by hour)
  @Get('stats/hourly')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async hourlyStats(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
    @Query('date') date?: string,
  ): Promise<{ data: { hour: number; revenue: number; orders: number }[] }> {
    const data = await this.orderStatsService.getHourlyStats(user, branchId, date);
    return { data };
  }

  // Task 12.1: GET /orders/my-tables (cashier view - orders grouped by table)
  @Get('tables')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async getOrdersByTables(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: TableOrdersDto[] }> {
    const data = await this.orderStatsService.getOrdersByTables(user, branchId);
    return { data };
  }

  // Task 12.2: GET /orders/history (order history with date filters)
  @Get('history')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async history(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: OrderDto[] }> {
    const data = await this.orderStatsService.getHistory(user, branchId, startDate, endDate);
    return { data };
  }

  @Get(':orderId')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async getOne(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.getById(user, orderId);
    return { data };
  }

  @Post()
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrderDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.create(user, dto);
    return { data };
  }

  @Post('merge')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async merge(
    @CurrentUser() user: JwtPayload,
    @Body() dto: MergeOrdersDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.orderBillingService.mergeOrders(user, dto);
    return { data };
  }

  @Patch(':orderId/table')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async transferTable(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: TransferOrderTableDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.orderBillingService.transferTable(user, orderId, dto);
    return { data };
  }

  @Post(':orderId/split')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async split(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: SplitOrderDto,
  ): Promise<{ data: SplitOrderResponseDto }> {
    const data = await this.orderBillingService.splitOrder(user, orderId, dto);
    return { data };
  }

  @Patch(':orderId/status')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.updateStatus(user, orderId, dto);
    return { data };
  }

  @Post(':orderId/deliver')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async deliver(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: DeliverOrderDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.deliver(user, orderId, dto);
    return { data };
  }

  @Post(':orderId/cancel')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async cancel(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Body() dto: CancelOrderDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.cancel(user, orderId, dto);
    return { data };
  }

  // US-C03: Toggle item prepared status (barista check từng món)
  @Patch(':orderId/items/:itemId/prepared')
  @Roles(StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async toggleItemPrepared(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body() dto: ToggleItemPreparedDto,
  ): Promise<{ data: OrderDto }> {
    const data = await this.ordersService.toggleItemPrepared(user, orderId, itemId, dto);
    return { data };
  }
}
