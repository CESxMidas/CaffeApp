import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import type { LoginResponseDto, MeResponseDto } from '@caffeapp/shared';
import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import { AuthService } from './auth.service';
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
}
