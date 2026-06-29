import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import type { BranchOperatorDto, StaffDto, StaffListItemDto } from '@caffeapp/shared';
import { isStationAccountEmail } from '@caffeapp/shared';
import { BranchAssignmentStatus, StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import { assertBranchAccess } from '@common/utils/branch-scope.util';
import type { JwtPayload } from '@common/types/jwt-payload.types';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  /** MANAGER/OWNER lists staff for branch assignment workflow. */
  async listStaff(payload: JwtPayload): Promise<{ data: StaffListItemDto[] }> {
    if (payload.role !== StaffRole.MANAGER && payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ quản lý mới được xem danh sách nhân viên');
    }

    const where =
      payload.role === StaffRole.MANAGER
        ? {
            isActive: true,
            role: { not: StaffRole.OWNER },
            OR: [
              { branchId: payload.branchId ?? undefined },
              { branchId: null },
              {
                branchAssignmentStatus: {
                  in: [BranchAssignmentStatus.NONE, BranchAssignmentStatus.REJECTED],
                },
              },
            ],
          }
        : {
            isActive: true,
            role: { not: StaffRole.OWNER },
          };

    const rows = await this.prisma.staff.findMany({
      where,
      include: {
        user: { select: { email: true } },
        branch: { select: { name: true } },
      },
      orderBy: { fullName: 'asc' },
    });

    return { data: rows.map((s) => this.toStaffListItemDto(s)) };
  }

  /** CASHIER+ lists active operators for station tablet staff picker (B-15). */
  async listBranchOperators(
    payload: JwtPayload,
    roles?: StaffRole[],
  ): Promise<{ data: BranchOperatorDto[] }> {
    if (!payload.branchId) {
      throw new BadRequestException('Chưa chọn chi nhánh');
    }
    assertBranchAccess(payload, payload.branchId);

    const roleFilter =
      roles?.length && roles.length > 0
        ? roles
        : [StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER];

    const rows = await this.prisma.staff.findMany({
      where: {
        branchId: payload.branchId,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
        role: { in: roleFilter },
      },
      include: { user: { select: { email: true } } },
      orderBy: { fullName: 'asc' },
    });

    return {
      data: rows
        .filter((s) => !isStationAccountEmail(s.user.email))
        .map((s) => ({
          id: s.id,
          fullName: s.fullName,
          role: s.role as BranchOperatorDto['role'],
        })),
    };
  }

  /** MANAGER+ proposes branch for a staff member — awaits OWNER approval. */
  async proposeBranchAssignment(
    payload: JwtPayload,
    staffId: string,
    branchId: string,
  ): Promise<{ data: StaffDto }> {
    if (payload.role !== StaffRole.MANAGER && payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ quản lý mới được đề xuất gán chi nhánh');
    }

    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff || !staff.isActive) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }
    if (staff.role === StaffRole.OWNER) {
      throw new BadRequestException('Không gán chi nhánh cho tài khoản chủ quán');
    }

    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, isActive: true },
    });
    if (!branch) {
      throw new BadRequestException('Chi nhánh không hợp lệ');
    }

    const updated = await this.prisma.staff.update({
      where: { id: staffId },
      data: {
        branchId,
        branchAssignmentStatus:
          payload.role === StaffRole.OWNER
            ? BranchAssignmentStatus.APPROVED
            : BranchAssignmentStatus.PENDING_OWNER,
        assignedByStaffId: payload.staffId,
        approvedAt: payload.role === StaffRole.OWNER ? new Date() : null,
      },
    });

    return { data: this.toStaffDto(updated) };
  }

  /** OWNER approves a pending branch assignment. */
  async approveBranchAssignment(payload: JwtPayload, staffId: string): Promise<{ data: StaffDto }> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được duyệt gán chi nhánh');
    }

    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }
    if (staff.branchAssignmentStatus !== BranchAssignmentStatus.PENDING_OWNER) {
      throw new BadRequestException('Không có đề xuất gán chi nhánh đang chờ duyệt');
    }
    if (!staff.branchId) {
      throw new BadRequestException('Thiếu chi nhánh trong đề xuất');
    }

    const updated = await this.prisma.staff.update({
      where: { id: staffId },
      data: {
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
        approvedAt: new Date(),
      },
    });

    return { data: this.toStaffDto(updated) };
  }

  /** OWNER rejects a pending branch assignment. */
  async rejectBranchAssignment(payload: JwtPayload, staffId: string): Promise<{ data: StaffDto }> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được từ chối gán chi nhánh');
    }

    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }
    if (staff.branchAssignmentStatus !== BranchAssignmentStatus.PENDING_OWNER) {
      throw new BadRequestException('Không có đề xuất gán chi nhánh đang chờ duyệt');
    }

    const updated = await this.prisma.staff.update({
      where: { id: staffId },
      data: {
        branchId: null,
        branchAssignmentStatus: BranchAssignmentStatus.REJECTED,
        approvedAt: null,
      },
    });

    return { data: this.toStaffDto(updated) };
  }

  /** OWNER lists staff awaiting branch approval. */
  async listPendingAssignments(payload: JwtPayload): Promise<{ data: StaffListItemDto[] }> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán xem danh sách chờ duyệt');
    }

    const rows = await this.prisma.staff.findMany({
      where: {
        branchAssignmentStatus: BranchAssignmentStatus.PENDING_OWNER,
        isActive: true,
      },
      include: {
        user: { select: { email: true } },
        branch: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return { data: rows.map((s) => this.toStaffListItemDto(s)) };
  }

  private toStaffListItemDto(staff: {
    id: string;
    userId: string;
    branchId: string | null;
    role: StaffRole;
    fullName: string;
    isActive: boolean;
    branchAssignmentStatus: BranchAssignmentStatus;
    user: { email: string };
    branch: { name: string } | null;
  }): StaffListItemDto {
    return {
      ...this.toStaffDto(staff),
      email: staff.user.email,
      branchName: staff.branch?.name ?? null,
    };
  }

  private toStaffDto(staff: {
    id: string;
    userId: string;
    branchId: string | null;
    role: StaffRole;
    fullName: string;
    isActive: boolean;
    branchAssignmentStatus: BranchAssignmentStatus;
  }): StaffDto {
    return {
      id: staff.id,
      userId: staff.userId,
      branchId: staff.branchId,
      role: staff.role as StaffDto['role'],
      fullName: staff.fullName,
      isActive: staff.isActive,
      branchAssignmentStatus: staff.branchAssignmentStatus as StaffDto['branchAssignmentStatus'],
    };
  }
}
