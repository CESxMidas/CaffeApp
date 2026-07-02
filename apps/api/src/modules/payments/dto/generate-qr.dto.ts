import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class GenerateQrDto {
  @IsNotEmpty({ message: 'orderId là bắt buộc' })
  @IsString()
  orderId!: string;

  @IsNotEmpty({ message: 'amount là bắt buộc' })
  @IsInt()
  @Min(1000, { message: 'amount phải lớn hơn hoặc bằng 1000' })
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;
}
