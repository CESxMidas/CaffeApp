import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ShiftStatus } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';

/** Ca hệ thống — 3 khung giờ cố định (theo B-01 STAKEHOLDER_QUESTIONNAIRE) */
const SHIFT_DEFS: { name: string; type: string; start: string; end: string; hourStart: number }[] =
  [
    { name: 'Ca đêm', type: 'night', start: '00:00', end: '08:00', hourStart: 0 },
    { name: 'Ca sáng', type: 'morning', start: '08:00', end: '16:00', hourStart: 8 },
    { name: 'Ca chiều', type: 'afternoon', start: '16:00', end: '24:00', hourStart: 16 },
  ];

@Injectable()
export class ShiftsScheduler {
  private readonly logger = new Logger(ShiftsScheduler.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mỗi giờ kiểm tra: nếu chưa có ca OPEN cho khung giờ hiện tại ở mỗi chi nhánh
   * thì tự động tạo ca mới (B-01, B-10).
   */
  @Cron('0 * * * *') // At minute 0 of every hour
  async ensureShiftOpen(): Promise<void> {
    const now = new Date();
    const hour = now.getHours();

    const def = SHIFT_DEFS.find((d) => {
      if (d.hourStart === 0) return hour >= 0 && hour < 8;
      if (d.hourStart === 8) return hour >= 8 && hour < 16;
      return hour >= 16;
    });

    if (!def) {
      this.logger.warn(`Không xác định được ca cho giờ hiện tại: ${hour}`);
      return;
    }

    try {
      const branches = await this.prisma.branch.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
      });

      for (const branch of branches) {
        const existing = await this.prisma.shift.findFirst({
          where: {
            branchId: branch.id,
            status: ShiftStatus.OPEN,
            shiftType: def.type,
          },
        });

        if (existing) continue; // Ca đã tồn tại

        await this.prisma.shift.create({
          data: {
            branchId: branch.id,
            name: `${def.name} — ${new Date().toLocaleDateString('vi-VN')}`,
            shiftType: def.type,
            startTime: def.start,
            endTime: def.end,
            openedAt: now,
            status: ShiftStatus.OPEN,
          },
        });

        this.logger.log(
          `Đã tự động mở ca "${def.name}" cho chi nhánh "${branch.name}" (${branch.id})`,
        );
      }
    } catch (error) {
      this.logger.error('Lỗi khi tự động tạo ca', (error as Error).stack);
    }
  }
}
