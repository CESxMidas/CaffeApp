import { Injectable } from '@nestjs/common';
import { NotificationType, Prisma, StaffRole } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async notifyBranchRoles(params: {
    branchId: string;
    roles: StaffRole[];
    type: NotificationType;
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    const staff = await this.prisma.staff.findMany({
      where: {
        branchId: params.branchId,
        role: { in: params.roles },
        isActive: true,
      },
      select: { id: true },
    });

    if (staff.length === 0) return;

    await this.prisma.notification.createMany({
      data: staff.map((s) => ({
        branchId: params.branchId,
        staffId: s.id,
        type: params.type,
        title: params.title,
        body: params.body,
        metadata: params.metadata ? (params.metadata as Prisma.InputJsonValue) : undefined,
      })),
    });
  }

  async listForStaff(staffId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { staffId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async unreadCount(staffId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { staffId, readAt: null },
    });
  }

  async markRead(staffId: string, notificationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, staffId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(staffId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { staffId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
