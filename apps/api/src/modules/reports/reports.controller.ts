import { Controller, Get, Query } from '@nestjs/common';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { RevenueReportQueryDto } from './dto/revenue-report-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('revenue')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async revenue(
    @CurrentUser() user: JwtPayload,
    @Query() query: RevenueReportQueryDto,
  ) {
    const data = await this.reportsService.getRevenue(user, query);
    return { data };
  }
}
