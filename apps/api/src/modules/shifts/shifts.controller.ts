import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { ShiftDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CloseShiftDto, OpenShiftDto } from './dto/shift.dto';
import { ShiftsService } from './shifts.service';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async list(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: ShiftDto[] }> {
    const data = await this.shiftsService.list(user, branchId);
    return { data };
  }

  @Get('active')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER, StaffRole.CASHIER)
  async getActive(
    @CurrentUser() user: JwtPayload,
    @Query('branchId') branchId?: string,
  ): Promise<{ data: ShiftDto | null }> {
    const data = await this.shiftsService.getActive(user, branchId);
    return { data };
  }

  @Post('open')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async open(
    @CurrentUser() user: JwtPayload,
    @Body() dto: OpenShiftDto,
  ): Promise<{ data: ShiftDto }> {
    const data = await this.shiftsService.open(user, dto);
    return { data };
  }

  @Post('close')
  @Roles(StaffRole.MANAGER, StaffRole.OWNER)
  async close(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CloseShiftDto,
  ): Promise<{ data: ShiftDto }> {
    const data = await this.shiftsService.close(user, dto);
    return { data };
  }
}
