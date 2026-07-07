import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PaymentDto } from '@caffeapp/shared';
import { OrderStatus, PaymentMethod, TableStatus, type Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { ActorResolverService } from '@common/audit/actor-resolver.service';
import { AuditService } from '@common/audit/audit.service';
import { assertBranchAccess, resolveBranchScope } from '@common/utils/branch-scope.util';
import { syncTableEmptyIfIdle } from '@common/utils/table-status.util';
import { generateVietQRData } from '@common/utils/vietqr.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { GenerateQrDto } from './dto/generate-qr.dto';
import type { VerifyPaymentDto } from './dto/verify-payment.dto';
import type { VoidPaymentDto } from './dto/void-payment.dto';

const PILOT_PAYMENT_METHODS = new Set<PaymentMethod>([
  PaymentMethod.CASH,
  PaymentMethod.BANK_TRANSFER,
]);

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly actorResolver: ActorResolverService,
  ) {}

  async create(payload: JwtPayload, dto: CreatePaymentDto): Promise<PaymentDto> {
    if (!PILOT_PAYMENT_METHODS.has(dto.method)) {
      throw new BadRequestException('Pilot chỉ hỗ trợ tiền mặt hoặc chuyển khoản');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { payments: true },
    });

    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }
    assertBranchAccess(payload, order.branchId);

    if (order.status === OrderStatus.PAID) {
      throw new ConflictException('Đơn đã thanh toán');
    }

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Đơn chưa sẵn sàng để thanh toán');
    }

    if (dto.amount < order.total) {
      throw new BadRequestException('Số tiền không đủ');
    }

    let changeAmount: number | null = null;
    if (dto.method === PaymentMethod.CASH) {
      changeAmount = dto.amount - order.total;
      if (changeAmount < 0) {
        throw new BadRequestException('Số tiền không đủ');
      }
    } else if (dto.changeAmount && dto.changeAmount > 0) {
      throw new BadRequestException('Tiền thừa chỉ áp dụng cho tiền mặt');
    }

    const paidAt = new Date();
    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      order.branchId,
    );

    const payment = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payment.create({
        data: {
          orderId: order.id,
          method: dto.method,
          amount: dto.amount,
          changeAmount,
          reference: dto.reference ?? null,
          paidAt,
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID, paidAt },
      });

      if (order.tableId) {
        await syncTableEmptyIfIdle(tx, order.tableId);
      }

      return created;
    });

    void this.audit.log({
      branchId: order.branchId,
      actorId: actorUserId,
      entityType: 'payment',
      entityId: payment.id,
      action: 'payment.created',
      afterData: {
        orderId: order.id,
        method: payment.method,
        amount: payment.amount,
      },
      metadata: dto.actedByStaffId
        ? ({ actedByStaffId: dto.actedByStaffId } as import('@prisma/client').Prisma.InputJsonValue)
        : undefined,
    });

    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method as PaymentDto['method'],
      amount: payment.amount,
      changeAmount: payment.changeAmount,
      reference: payment.reference,
      paidAt: payment.paidAt.toISOString(),
    };
  }

  // VietQR: Generate QR code for bank transfer payment
  async generateQr(
    payload: JwtPayload,
    dto: GenerateQrDto,
  ): Promise<{
    qrUrl: string;
    bankCode: string;
    accountNo: string;
    accountName: string;
    amount: number;
    addInfo: string;
  }> {
    const scopedBranchId = resolveBranchScope(payload);

    // Verify order exists and belongs to branch
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }

    if (order.branchId !== scopedBranchId) {
      throw new NotFoundException('Đơn không thuộc chi nhánh này');
    }

    // Get branch bank info
    const branch = await this.prisma.branch.findUnique({
      where: { id: scopedBranchId },
      select: {
        bankInfo: true,
      },
    });

    if (!branch?.bankInfo) {
      throw new NotFoundException('Chi nhánh chưa cấu hình thông tin ngân hàng');
    }

    // Parse bank info from JSON
    const bankInfo = branch.bankInfo as {
      bank?: string;
      bankCode?: string;
      account?: string;
      holder?: string;
    };

    if (!bankInfo.account || !bankInfo.bank) {
      throw new NotFoundException('Thông tin ngân hàng không hợp lệ');
    }

    // Generate VietQR data
    const qrData = generateVietQRData({
      bankCode: bankInfo.bankCode || bankInfo.bank,
      accountNo: bankInfo.account,
      accountName: bankInfo.holder || '',
      amount: dto.amount,
      addInfo: `Don#${order.orderNumber}`,
    });

    return {
      qrUrl: qrData.qrUrl,
      bankCode: qrData.bankCode,
      accountNo: qrData.accountNo,
      accountName: qrData.accountName,
      amount: qrData.amount || dto.amount,
      addInfo: qrData.addInfo || `Don#${order.orderNumber}`,
    };
  }

  // Get payment by order ID
  async getByOrder(payload: JwtPayload, orderId: string): Promise<PaymentDto[]> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Đơn không tồn tại');
    }

    assertBranchAccess(payload, order.branchId);

    const payments = await this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((p) => ({
      id: p.id,
      orderId: p.orderId,
      method: p.method as PaymentDto['method'],
      amount: p.amount,
      changeAmount: p.changeAmount,
      reference: p.reference,
      paidAt: p.paidAt.toISOString(),
    }));
  }

  // Void a payment (manager corrects a mistaken charge). The payment row is
  // removed and the order returns to READY; the full payment snapshot plus the
  // mandatory reason live on in the audit log, which is the accounting record.
  async void(
    payload: JwtPayload,
    paymentId: string,
    dto: VoidPaymentDto,
  ): Promise<{ orderId: string }> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }
    assertBranchAccess(payload, payment.order.branchId);

    if (payment.order.status !== OrderStatus.PAID) {
      throw new ConflictException('Đơn không ở trạng thái đã thanh toán');
    }

    const actorUserId = await this.actorResolver.resolveActorUserId(
      payload,
      dto.actedByStaffId,
      payment.order.branchId,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id: paymentId } });

      await tx.order.update({
        where: { id: payment.orderId },
        data: { status: OrderStatus.READY, paidAt: null },
      });

      // The order is active again, so re-occupy its table.
      if (payment.order.tableId) {
        await tx.table.update({
          where: { id: payment.order.tableId },
          data: { status: TableStatus.OCCUPIED },
        });
      }
    });

    void this.audit.log({
      branchId: payment.order.branchId,
      actorId: actorUserId,
      entityType: 'payment',
      entityId: payment.id,
      action: 'payment.voided',
      beforeData: {
        orderId: payment.orderId,
        orderNumber: payment.order.orderNumber,
        method: payment.method,
        amount: payment.amount,
        changeAmount: payment.changeAmount,
        reference: payment.reference,
        paidAt: payment.paidAt.toISOString(),
      } as Prisma.InputJsonValue,
      metadata: {
        reason: dto.reason,
        ...(dto.actedByStaffId ? { actedByStaffId: dto.actedByStaffId } : {}),
      } as Prisma.InputJsonValue,
    });

    return { orderId: payment.orderId };
  }

  // Verify bank transfer payment (manual confirmation by manager)
  async verify(payload: JwtPayload, paymentId: string, dto: VerifyPaymentDto): Promise<PaymentDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Giao dịch không tồn tại');
    }

    assertBranchAccess(payload, payment.order.branchId);

    if (payment.method !== PaymentMethod.BANK_TRANSFER) {
      throw new BadRequestException('Chỉ áp dụng cho thanh toán chuyển khoản');
    }

    // Update payment reference with verification info
    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        reference: dto.verified
          ? `Verified by ${payload.email} at ${new Date().toISOString()}${dto.notes ? ' - ' + dto.notes : ''}`
          : payment.reference,
      },
    });

    return {
      id: updated.id,
      orderId: updated.orderId,
      method: updated.method as PaymentDto['method'],
      amount: updated.amount,
      changeAmount: updated.changeAmount,
      reference: updated.reference,
      paidAt: updated.paidAt.toISOString(),
    };
  }
}
