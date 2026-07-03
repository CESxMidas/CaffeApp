import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import type {
  BranchBankInfoDto,
  BranchDto,
  ChangePasswordCodeResponseDto,
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
import { BranchAssignmentStatus, NotificationType, StaffRole, type Staff } from '@prisma/client';
import { AuditService } from '@common/audit/audit.service';
import { EmailService } from '@common/email/email.service';
import { PrismaService } from '@common/prisma/prisma.service';
import { NotificationsService } from '@modules/notifications/notifications.service';
import type { JwtPayload } from '@common/types/jwt-payload.types';
import type { ChangePasswordDto, ConfirmChangePasswordDto } from './dto/change-password.dto';
import type { LoginDto } from './dto/login.dto';

const PASSWORD_CHANGE_OTP_MINUTES = 10;
const PASSWORD_CHANGE_MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly email: EmailService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
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

  async requestPasswordChangeCode(
    payload: JwtPayload,
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordCodeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { staff: true },
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

    const code = String(randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, 10);
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.passwordChangeOtp.updateMany({
      where: { userId: user.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    await this.prisma.passwordChangeOtp.create({
      data: {
        userId: user.id,
        codeHash,
        newPasswordHash: passwordHash,
        expiresAt: new Date(Date.now() + PASSWORD_CHANGE_OTP_MINUTES * 60_000),
      },
    });

    await this.email.sendPasswordChangeCode({
      to: user.email,
      fullName: user.fullName,
      code,
      expiresInMinutes: PASSWORD_CHANGE_OTP_MINUTES,
    });

    return { expiresInMinutes: PASSWORD_CHANGE_OTP_MINUTES };
  }

  async confirmPasswordChange(payload: JwtPayload, dto: ConfirmChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { staff: true },
    });

    if (!user || !user.isActive || !user.staff) {
      throw new UnauthorizedException('Session không hợp lệ');
    }

    const otp = await this.prisma.passwordChangeOtp.findFirst({
      where: {
        userId: user.id,
        consumedAt: null,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new BadRequestException('Mã xác nhận không hợp lệ hoặc đã hết hạn');
    }

    if (otp.attempts >= PASSWORD_CHANGE_MAX_ATTEMPTS) {
      await this.prisma.passwordChangeOtp.update({
        where: { id: otp.id },
        data: { consumedAt: new Date() },
      });
      throw new BadRequestException('Mã xác nhận đã nhập sai quá số lần cho phép');
    }

    const codeValid = await bcrypt.compare(dto.code, otp.codeHash);
    if (!codeValid) {
      await this.prisma.passwordChangeOtp.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Mã xác nhận không đúng');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: otp.newPasswordHash },
      });
      await tx.passwordChangeOtp.update({
        where: { id: otp.id },
        data: { consumedAt: new Date() },
      });
    });

    await this.audit.log({
      branchId: user.staff.branchId,
      actorId: user.id,
      entityType: 'USER',
      entityId: user.id,
      action: 'auth.password_changed',
      metadata: {
        staffId: user.staff.id,
        staffRole: user.staff.role,
        email: user.email,
      },
    });

    if (user.staff.branchId) {
      await this.notifications.notifyBranchRoles({
        branchId: user.staff.branchId,
        roles: [StaffRole.MANAGER],
        type: NotificationType.SYSTEM,
        title: 'Nhân viên đổi mật khẩu',
        body: `${user.fullName} (${user.email}) đã đổi mật khẩu thành công.`,
        metadata: {
          event: 'auth.password_changed',
          staffId: user.staff.id,
          userId: user.id,
          email: user.email,
        },
      });

      const owners = await this.prisma.staff.findMany({
        where: {
          role: StaffRole.OWNER,
          isActive: true,
        },
        select: { id: true },
      });

      await this.notifications.notifyStaff({
        branchId: user.staff.branchId,
        staffIds: owners.map((owner) => owner.id),
        type: NotificationType.SYSTEM,
        title: 'Nhân viên đổi mật khẩu',
        body: `${user.fullName} (${user.email}) đã đổi mật khẩu thành công.`,
        metadata: {
          event: 'auth.password_changed',
          staffId: user.staff.id,
          userId: user.id,
          email: user.email,
        },
      });
    }
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
