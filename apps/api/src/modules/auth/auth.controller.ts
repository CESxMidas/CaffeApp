import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type {
  ChangePasswordCodeResponseDto,
  LoginResponseDto,
  MeResponseDto,
} from '@caffeapp/shared';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { AuthService } from './auth.service';
import { ChangePasswordDto, ConfirmChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

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

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshDto,
  ): Promise<{ data: { accessToken: string; expiresIn: number } }> {
    const data = await this.authService.refresh(dto.refreshToken);
    return { data };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ data: ChangePasswordCodeResponseDto }> {
    const data = await this.authService.requestPasswordChangeCode(user, dto);
    return { data };
  }

  @Post('change-password/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmChangePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ConfirmChangePasswordDto,
  ): Promise<{ data: { ok: true } }> {
    await this.authService.confirmPasswordChange(user, dto);
    return { data: { ok: true } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(): Promise<{ data: { ok: true } }> {
    return { data: { ok: true } };
  }
}
