import { BadRequestException, Injectable } from '@nestjs/common';
import { isStationAccountEmail } from '@caffeapp/shared';
import { BranchAssignmentStatus, StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';

@Injectable()
export class ActorResolverService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves audit `actorId` (users.id) from JWT + optional actedByStaffId.
   * Station accounts must send actedByStaffId (B-15).
   */
  async resolveActorUserId(
    payload: JwtPayload,
    actedByStaffId: string | undefined,
    branchId: string,
  ): Promise<string> {
    const caller = await this.prisma.staff.findUnique({
      where: { id: payload.staffId },
      include: { user: { select: { email: true } } },
    });

    if (!caller) {
      throw new BadRequestException('Phiên đăng nhập không hợp lệ');
    }

    const stationSession = isStationAccountEmail(caller.user.email);

    if (stationSession && !actedByStaffId) {
      throw new BadRequestException('Tablet trạm: chọn nhân viên xác nhận thao tác');
    }

    if (!actedByStaffId) {
      return payload.sub;
    }

    const actorStaff = await this.prisma.staff.findFirst({
      where: {
        id: actedByStaffId,
        branchId,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
        role: { in: [StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER] },
      },
    });

    if (!actorStaff) {
      throw new BadRequestException('Nhân viên xác nhận không hợp lệ');
    }

    if (
      isStationAccountEmail(
        (await this.prisma.user.findUnique({ where: { id: actorStaff.userId } }))?.email ?? '',
      )
    ) {
      throw new BadRequestException('Không chọn tài khoản trạm làm nhân viên thao tác');
    }

    return actorStaff.userId;
  }
}
