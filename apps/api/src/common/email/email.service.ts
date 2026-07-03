import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendPasswordChangeCode(params: {
    to: string;
    fullName: string;
    code: string;
    expiresInMinutes: number;
  }): Promise<void> {
    const host = this.config.get<string>('email.host');
    const user = this.config.get<string>('email.user');
    const pass = this.config.get<string>('email.pass');
    const from = this.config.get<string>('email.from') || user;

    if (!host || !user || !pass || !from) {
      this.logger.warn(`SMTP chưa cấu hình; OTP đổi mật khẩu cho ${params.to}: ${params.code}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port: this.config.get<number>('email.port', 587),
      secure: this.config.get<boolean>('email.secure', false),
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: params.to,
      subject: 'Mã xác nhận đổi mật khẩu CaffeApp',
      text: [
        `Xin chào ${params.fullName},`,
        '',
        `Mã xác nhận đổi mật khẩu của bạn là: ${params.code}`,
        `Mã có hiệu lực trong ${params.expiresInMinutes} phút.`,
        '',
        'Nếu bạn không yêu cầu đổi mật khẩu, vui lòng báo quản lý/chủ quán ngay.',
      ].join('\n'),
    });
  }
}
