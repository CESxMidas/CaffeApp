import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from '@/config/configuration';
import { validateEnv } from '@/config/env.validation';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { PrismaModule } from '@common/prisma/prisma.module';
import { HealthModule } from '@common/health/health.module';
import { AuditModule } from '@common/audit/audit.module';
import { EmailModule } from '@common/email/email.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { StaffModule } from '@modules/staff/staff.module';
import { BranchesModule } from '@modules/branches/branches.module';
import { TablesModule } from '@modules/tables/tables.module';
import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { ReportsModule } from '@modules/reports/reports.module';
import { ShiftsModule } from '@modules/shifts/shifts.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [configuration],
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    HealthModule,
    AuditModule,
    EmailModule,
    AuthModule,
    UsersModule,
    StaffModule,
    BranchesModule,
    TablesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ReportsModule,
    ShiftsModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
