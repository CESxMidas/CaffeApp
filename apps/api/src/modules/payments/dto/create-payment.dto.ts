import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaymentMethod } from '@prisma/client';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class CreatePaymentDto {
  @IsEntityId()
  orderId!: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  changeAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reference?: string;
}
