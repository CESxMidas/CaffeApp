import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import type { TableDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: TableDto[] }> {
    const data = await this.tablesService.listForBranch(user, branchId);
    return { data };
  }

  // Task 7.2: GET /tables/:id endpoint
  @Get(':tableId')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  async getOne(
    @CurrentUser() user: JwtPayload,
    @Param('tableId') tableId: string,
  ): Promise<{ data: TableDto }> {
    const data = await this.tablesService.getById(user, tableId);
    return { data };
  }

  // Task 7.1: PATCH /tables/:id/status endpoint
  @Patch(':tableId/status')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('tableId') tableId: string,
    @Body() dto: UpdateTableStatusDto,
  ): Promise<{ data: TableDto }> {
    const data = await this.tablesService.updateStatus(user, tableId, dto);
    return { data };
  }
}
