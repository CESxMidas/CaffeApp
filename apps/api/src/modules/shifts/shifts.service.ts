import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { ShiftDto } from '@caffeapp/shared';
import { OrderStatus, ShiftStatus } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { resolveBranchScope } from '@common/utils/branch-scope.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { OpenShiftDto, CloseShiftDto } from './dto/shift.dto';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(payload: JwtPayload, branchId?: string): Promise<ShiftDto[]> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    const shifts = await this.prisma.shift.findMany({
      where: { branchId: scopedBranchId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return shifts.map((s) => this.toShiftDto(s));
  }

  async getActive(payload: JwtPayload, branchId?: string): Promise<ShiftDto | null> {
    const scopedBranchId = resolveBranchScope(payload, branchId);

    const shift = await this.prisma.shift.findFirst({
      where: { branchId: scopedBranchId, status: ShiftStatus.OPEN },
      orderBy: { createdAt: 'desc' },
    });

    return shift ? this.toShiftDto(shift) : null;
  }

  async open(payload: JwtPayload, dto: OpenShiftDto): Promise<ShiftDto> {
    const branchId = resolveBranchScope(payload, dto.branchId);

    const existing = await this.prisma.shift.findFirst({
      where: { branchId, status: ShiftStatus.OPEN },
    });
    if (existing) {
      throw new ConflictException('Đã có ca đang mở');
    }

    const shift = await this.prisma.shift.create({
      data: {
        branchId,
        name: dto.name,
        shiftType: dto.shiftType,
        startTime: dto.startTime,
        endTime: dto.endTime,
        openedAt: new Date(),
        status: ShiftStatus.OPEN,
      },
    });

    return this.toShiftDto(shift);
  }

  async close(payload: JwtPayload, dto: CloseShiftDto): Promise<ShiftDto> {
    const shift = await this.prisma.shift.findUnique({
      where: { id: dto.shiftId },
    });
    if (!shift) {
      throw new NotFoundException('Ca không tồn tại');
    }

    const scopedBranchId = resolveBranchScope(payload);
    if (shift.branchId !== scopedBranchId) {
      throw new NotFoundException('Ca không tồn tại');
    }

    if (shift.status === ShiftStatus.CLOSED) {
      throw new ConflictException('Ca đã đóng');
    }

    const closedAt = new Date();

    // Prefer orders explicitly attached to this shift; include only legacy untagged orders by time.
    const orders = await this.prisma.order.findMany({
      where: {
        branchId: shift.branchId,
        status: OrderStatus.PAID,
        OR: [
          { shiftId: shift.id },
          {
            shiftId: null,
            paidAt: {
              gte: shift.openedAt ?? shift.createdAt,
              lte: closedAt,
            },
          },
        ],
      },
      select: { total: true },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    const updated = await this.prisma.shift.update({
      where: { id: dto.shiftId },
      data: {
        status: ShiftStatus.CLOSED,
        closedAt,
        totalRevenue,
        totalOrders,
      },
    });

    return this.toShiftDto(updated);
  }

  private toShiftDto(s: {
    id: string;
    branchId: string;
    name: string;
    shiftType: string;
    startTime: string;
    endTime: string;
    openedAt: Date | null;
    closedAt: Date | null;
    status: ShiftStatus;
    totalRevenue: number;
    totalOrders: number;
    createdAt: Date;
    updatedAt: Date;
  }): ShiftDto {
    return {
      id: s.id,
      branchId: s.branchId,
      name: s.name,
      shiftType: s.shiftType,
      startTime: s.startTime,
      endTime: s.endTime,
      openedAt: s.openedAt?.toISOString() ?? null,
      closedAt: s.closedAt?.toISOString() ?? null,
      status: s.status === ShiftStatus.OPEN ? 'OPEN' : 'CLOSED',
      totalRevenue: s.totalRevenue,
      totalOrders: s.totalOrders,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
