import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { OrderDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliverOrderDto } from './dto/deliver-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
}
