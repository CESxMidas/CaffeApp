import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { PaymentDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePaymentDto,
  ): Promise<{ data: PaymentDto }> {
    const data = await this.paymentsService.create(user, dto);
    return { data };
  }

  // VietQR: Generate QR code for bank transfer payment
  @Post('generate-qr')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async generateQr(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GenerateQrDto,
  ): Promise<{
    data: {
      qrUrl: string;
      bankCode: string;
      accountNo: string;
      accountName: string;
      amount: number;
      addInfo: string;
    };
  }> {
    const data = await this.paymentsService.generateQr(user, dto);
    return { data };
  }

  // Get payment by order ID
  @Get('by-order/:orderId')
  @Roles(StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER)
  async getByOrder(
    @CurrentUser() user: JwtPayload,
    @Param('orderId') orderId: string,
  ): Promise<{ data: PaymentDto[] }> {
    const data = await this.paymentsService.getByOrder(user, orderId);
    return { data };
  }

  // Verify bank transfer payment (manual confirmation by manager)
  @Post(':paymentId/verify')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async verify(
    @CurrentUser() user: JwtPayload,
    @Param('paymentId') paymentId: string,
    @Body() dto: { verified: boolean; notes?: string },
  ): Promise<{ data: PaymentDto }> {
    const data = await this.paymentsService.verify(user, paymentId, dto);
    return { data };
  }
}
