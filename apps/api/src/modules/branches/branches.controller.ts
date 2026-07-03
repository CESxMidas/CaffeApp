import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import type { BranchDto } from '@caffeapp/shared';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload): Promise<{ data: BranchDto[] }> {
    const data = await this.branchesService.listForUser(user);
    return { data };
  }

  @Post()
  @Roles(StaffRole.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateBranchDto,
  ): Promise<{ data: BranchDto }> {
    const data = await this.branchesService.create(user, dto);
    return { data };
  }

  @Patch(':id')
  @Roles(StaffRole.OWNER)
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ): Promise<{ data: BranchDto }> {
    const data = await this.branchesService.update(user, id, dto);
    return { data };
  }

  @Delete(':id')
  @Roles(StaffRole.OWNER)
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ data: BranchDto }> {
    const data = await this.branchesService.remove(user, id);
    return { data };
  }
}
