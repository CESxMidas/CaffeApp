import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { validateEnv } from '@/config/env.validation';
import { PrismaModule } from '@common/prisma/prisma.module';
import { HealthModule } from '@common/health/health.module';
import { AuditModule } from '@common/audit/audit.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { StaffModule } from '@modules/staff/staff.module';
import { BranchesModule } from '@modules/branches/branches.module';
import { TablesModule } from '@modules/tables/tables.module';
import { ProductsModule } from '@modules/products/products.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { ReportsModule } from '@modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    AuditModule,
    AuthModule,
    UsersModule,
    StaffModule,
    BranchesModule,
    TablesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ReportsModule,
  ],
})
export class AppModule {}
