import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type {
  BranchBankInfoDto,
  BranchDto,
  LoginResponseDto,
  MeResponseDto,
  StaffDto,
  UserDto,
} from '@caffeapp/shared';
import {
  BranchAssignmentStatus as SharedBranchAssignmentStatus,
  isStationAccountEmail,
} from '@caffeapp/shared';
import * as bcrypt from 'bcrypt';
import { BranchAssignmentStatus, StaffRole, type Staff } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { staff: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    if (!user.staff || !user.staff.isActive) {
      throw new ForbiddenException('Tài khoản nhân viên không hoạt động');
    }

    const staff = user.staff;
    this.assertStaffCanLogin(staff);

    const branch = await this.resolveLoginBranch(staff);
    const tokens = this.issueTokens(user.id, user.email, staff);
    const expiresIn = this.getAccessExpiresInSeconds();

    return {
      ...tokens,
      expiresIn,
      user: this.toUserDto(user),
      staff: this.toStaffDto(staff, user.email),
      branch,
    };
  }

  async getMe(payload: JwtPayload): Promise<MeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { staff: true },
    });

    if (!user || !user.isActive || !user.staff || !user.staff.isActive) {
      throw new UnauthorizedException('Session không hợp lệ');
    }

    const branch = await this.resolveLoginBranch(user.staff);

    return {
      user: this.toUserDto(user),
      staff: this.toStaffDto(user.staff, user.email),
      branch,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { staff: true },
      });

      if (!user || !user.isActive || !user.staff || !user.staff.isActive) {
        throw new UnauthorizedException('Session không hợp lệ');
      }

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          staffId: user.staff.id,
          email: user.email,
          role: user.staff.role as StaffDto['role'],
          branchId: user.staff.role === StaffRole.OWNER ? null : user.staff.branchId,
          type: 'access',
        },
        { expiresIn: this.config.get<string>('jwt.expiresIn', '15m') as `${number}m` },
      );

      return { accessToken, expiresIn: this.getAccessExpiresInSeconds() };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  async changePassword(payload: JwtPayload, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Session không hợp lệ');
    }

    const passwordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!passwordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    const samePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (samePassword) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu hiện tại');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
  }

  /** Non-owner staff must have owner-approved branch assignment — never self-selected. */
  private assertStaffCanLogin(staff: Staff): void {
    if (staff.role === StaffRole.OWNER) {
      return;
    }

    switch (staff.branchAssignmentStatus) {
      case BranchAssignmentStatus.APPROVED:
        if (!staff.branchId) {
          throw new ForbiddenException('Chưa được gán chi nhánh. Liên hệ quản lý.');
        }
        return;
      case BranchAssignmentStatus.PENDING_OWNER:
        throw new ForbiddenException(
          'Đang chờ chủ quán duyệt gán chi nhánh. Vui lòng liên hệ quản lý.',
        );
      case BranchAssignmentStatus.REJECTED:
        throw new ForbiddenException('Gán chi nhánh bị từ chối. Quản lý cần gửi đề xuất mới.');
      default:
        throw new ForbiddenException(
          'Chưa được quản lý gán chi nhánh. Nhân viên không tự chọn chi nhánh.',
        );
    }
  }

  private async resolveLoginBranch(staff: Staff): Promise<BranchDto | null> {
    if (staff.role === StaffRole.OWNER) {
      return null;
    }
    if (staff.branchAssignmentStatus !== BranchAssignmentStatus.APPROVED || !staff.branchId) {
      return null;
    }
    const branchRecord = await this.prisma.branch.findUnique({
      where: { id: staff.branchId },
    });
    return branchRecord ? this.toBranchDto(branchRecord) : null;
  }

  private issueTokens(userId: string, email: string, staff: Staff) {
    const basePayload: Omit<JwtPayload, 'type'> = {
      sub: userId,
      staffId: staff.id,
      email,
      role: staff.role as StaffDto['role'],
      branchId: staff.role === StaffRole.OWNER ? null : staff.branchId,
    };

    const accessToken = this.jwtService.sign(
      { ...basePayload, type: 'access' },
      { expiresIn: this.config.get<string>('jwt.expiresIn', '15m') as `${number}m` },
    );

    const refreshToken = this.jwtService.sign(
      { ...basePayload, type: 'refresh' },
      { expiresIn: this.config.get<string>('jwt.refreshExpiresIn', '7d') as `${number}d` },
    );

    return { accessToken, refreshToken };
  }

  private getAccessExpiresInSeconds(): number {
    const expiresIn = this.config.get<string>('jwt.expiresIn', '15m');
    const match = /^(\d+)([smhd])$/.exec(expiresIn);
    if (!match) return 900;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
    return value * (multipliers[unit] ?? 60);
  }

  private toUserDto(user: { id: string; email: string; fullName: string }): UserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  }

  private toStaffDto(staff: Staff, email: string): StaffDto {
    return {
      id: staff.id,
      userId: staff.userId,
      branchId: staff.branchId,
      role: staff.role as StaffDto['role'],
      fullName: staff.fullName,
      phone: staff.phone,
      isActive: staff.isActive,
      branchAssignmentStatus: staff.branchAssignmentStatus as SharedBranchAssignmentStatus,
      isStationAccount: isStationAccountEmail(email),
    };
  }

  private toBranchDto(branch: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    bankInfo?: unknown;
    isActive: boolean;
  }): BranchDto {
    return {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      bankInfo: this.toBranchBankInfo(branch.bankInfo),
      isActive: branch.isActive,
    };
  }

  private toBranchBankInfo(value: unknown): BranchBankInfoDto | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    const bankInfo = value as Record<string, unknown>;
    const bank = typeof bankInfo.bank === 'string' ? bankInfo.bank : null;
    const account = typeof bankInfo.account === 'string' ? bankInfo.account : null;

    if (!bank || !account) {
      return null;
    }

    return {
      bank,
      account,
      bankCode: typeof bankInfo.bankCode === 'string' ? bankInfo.bankCode : null,
      holder: typeof bankInfo.holder === 'string' ? bankInfo.holder : null,
    };
  }
}
