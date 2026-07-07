import { Body, Controller, Post } from '@nestjs/common';
import { StaffRole } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { CreateUserDto } from './dto/create-user.dto';
import type { CreatedUserDto } from './users.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(StaffRole.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateUserDto,
  ): Promise<{ data: CreatedUserDto }> {
    const data = await this.usersService.create(user, dto);
    return { data };
  }
}
