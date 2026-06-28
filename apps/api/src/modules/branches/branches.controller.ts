import { Controller, Get } from '@nestjs/common';
import type { BranchDto } from '@caffeapp/shared';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { BranchesService } from './branches.service';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload): Promise<{ data: BranchDto[] }> {
    const data = await this.branchesService.listForUser(user);
    return { data };
  }
}
