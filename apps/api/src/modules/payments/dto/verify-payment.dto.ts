import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class VerifyPaymentDto {
  @IsBoolean({ message: 'verified phải là boolean' })
  verified!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'notes tối đa 500 ký tự' })
  notes?: string;
}
