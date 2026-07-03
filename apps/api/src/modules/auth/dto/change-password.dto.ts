import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Mật khẩu mới cần có ít nhất 1 chữ và 1 số',
  })
  newPassword!: string;
}

export class ConfirmChangePasswordDto {
  @IsString()
  @MinLength(6)
  code!: string;
}
