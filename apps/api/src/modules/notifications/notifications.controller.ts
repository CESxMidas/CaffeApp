import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async list(@CurrentUser() user: JwtPayload) {
    const data = await this.notificationsService.listForStaff(user.staffId);
    return {
      data: data.map((n) => ({
        id: n.id,
        branchId: n.branchId,
        type: n.type,
        title: n.title,
        body: n.body,
        readAt: n.readAt?.toISOString() ?? null,
        metadata: n.metadata,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  }

  @Get('unread-count')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async unreadCount(@CurrentUser() user: JwtPayload) {
    const count = await this.notificationsService.unreadCount(user.staffId);
    return { data: { count } };
  }

  @Patch(':id/read')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async markRead(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    await this.notificationsService.markRead(user.staffId, id);
    return { data: { ok: true } };
  }

  @Post('read-all')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async markAllRead(@CurrentUser() user: JwtPayload) {
    await this.notificationsService.markAllRead(user.staffId);
    return { data: { ok: true } };
  }
}
