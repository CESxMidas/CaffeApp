import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { LoginResponseDto, MeResponseDto } from '@caffeapp/shared';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<{ data: LoginResponseDto }> {
    const data = await this.authService.login(dto);
    return { data };
  }

  @Get('me')
  async me(@CurrentUser() user: JwtPayload): Promise<{ data: MeResponseDto }> {
    const data = await this.authService.getMe(user);
    return { data };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ data: { ok: true } }> {
    await this.authService.changePassword(user, dto);
    return { data: { ok: true } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ data: { ok: true } }> {
    return { data: { ok: true } };
  }
}
