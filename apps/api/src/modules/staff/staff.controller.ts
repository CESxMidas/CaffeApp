import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import type { StaffDto, StaffListItemDto, BranchOperatorDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { ProposeBranchAssignmentDto } from './dto/propose-branch-assignment.dto';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  list(@CurrentUser() user: JwtPayload): Promise<{ data: StaffListItemDto[] }> {
    return this.staffService.listStaff(user);
  }

  @Get('branch-operators')
  @Roles(StaffRole.CASHIER, StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER)
  listBranchOperators(
    @CurrentUser() user: JwtPayload,
    @Query('role') role?: string,
  ): Promise<{ data: BranchOperatorDto[] }> {
    const roles = role
      ?.split(',')
      .map((r) => r.trim())
      .filter((r): r is StaffRole => Object.values(StaffRole).includes(r as StaffRole));
    return this.staffService.listBranchOperators(user, roles?.length ? roles : undefined);
  }

  @Get('branch-assignments/pending')
  @Roles(StaffRole.OWNER)
  listPending(@CurrentUser() user: JwtPayload): Promise<{ data: StaffListItemDto[] }> {
    return this.staffService.listPendingAssignments(user);
  }

  @Post(':id/branch-assignment')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  propose(
    @CurrentUser() user: JwtPayload,
    @Param('id') staffId: string,
    @Body() dto: ProposeBranchAssignmentDto,
  ): Promise<{ data: StaffDto }> {
    return this.staffService.proposeBranchAssignment(user, staffId, dto.branchId);
  }

  @Post(':id/branch-assignment/approve')
  @Roles(StaffRole.OWNER)
  approve(
    @CurrentUser() user: JwtPayload,
    @Param('id') staffId: string,
  ): Promise<{ data: StaffDto }> {
    return this.staffService.approveBranchAssignment(user, staffId);
  }

  @Post(':id/branch-assignment/reject')
  @Roles(StaffRole.OWNER)
  reject(
    @CurrentUser() user: JwtPayload,
    @Param('id') staffId: string,
  ): Promise<{ data: StaffDto }> {
    return this.staffService.rejectBranchAssignment(user, staffId);
  }
}
