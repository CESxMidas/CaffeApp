import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderBillingService } from './order-billing.service';
import { OrderStatsService } from './order-stats.service';
import { OrdersGateway } from './orders.gateway';

@Module({
  imports: [NotificationsModule, JwtModule.register({ secret: process.env.JWT_SECRET ?? '' })],
  controllers: [OrdersController],
  providers: [OrdersService, OrderBillingService, OrderStatsService, OrdersGateway],
})
export class OrdersModule {}
