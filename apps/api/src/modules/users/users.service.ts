import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserDto, StaffDto } from '@caffeapp/shared';
import { BranchAssignmentStatus, NotificationType, StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { NotificationsService } from '@modules/notifications/notifications.service';
import type { CreateUserDto } from './dto/create-user.dto';

export interface CreatedUserDto {
  user: UserDto;
  staff: StaffDto;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /** OWNER creates a new user + staff record. Branch assignment auto-approved for Owner's choice. */
  async create(payload: JwtPayload, dto: CreateUserDto): Promise<CreatedUserDto> {
    if (payload.role !== StaffRole.OWNER) {
      throw new ForbiddenException('Chỉ chủ quán mới được tạo tài khoản');
    }

    // Check email uniqueness
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Validate branch if provided
    if (dto.branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: { id: dto.branchId, isActive: true },
      });
      if (!branch) {
        throw new BadRequestException('Chi nhánh không tồn tại');
      }
    }

    // OWNER role: no branch assignment needed
    const branchAssignmentStatus =
      dto.role === StaffRole.OWNER
        ? BranchAssignmentStatus.NONE
        : dto.branchId
          ? BranchAssignmentStatus.APPROVED // Owner directly assigns → approved
          : BranchAssignmentStatus.NONE;

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash,
          fullName: dto.fullName,
        },
      });

      const staff = await tx.staff.create({
        data: {
          userId: user.id,
          branchId: dto.branchId ?? null,
          role: dto.role,
          fullName: dto.fullName,
          phone: dto.phone ?? null,
          branchAssignmentStatus,
        },
      });

      return { user, staff };
    });

    // Notify OWNERs about new account creation (if not already OWNER)
    if (dto.role !== StaffRole.OWNER) {
      const owners = await this.prisma.staff.findMany({
        where: { role: StaffRole.OWNER, isActive: true },
        select: { id: true },
      });

      void this.notifications.notifyStaff({
        branchId: dto.branchId ?? payload.branchId ?? '', // fallback for notification routing
        staffIds: owners.map((o) => o.id),
        type: NotificationType.SYSTEM,
        title: 'Tài khoản mới được tạo',
        body: `${dto.fullName} (${dto.role}) đã được thêm vào hệ thống`,
        metadata: { staffId: result.staff.id, role: dto.role },
      });
    }

    return {
      user: { id: result.user.id, email: result.user.email, fullName: result.user.fullName },
      staff: {
        id: result.staff.id,
        userId: result.staff.userId,
        branchId: result.staff.branchId,
        role: result.staff.role as StaffDto['role'],
        fullName: result.staff.fullName,
        phone: result.staff.phone,
        isActive: result.staff.isActive,
        branchAssignmentStatus: result.staff
          .branchAssignmentStatus as StaffDto['branchAssignmentStatus'],
      },
    };
  }
}
