import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class VoidPaymentDto {
  @IsString()
  @MinLength(5, { message: 'Lý do hủy thanh toán cần ít nhất 5 ký tự' })
  @MaxLength(500, { message: 'Lý do tối đa 500 ký tự' })
  reason!: string;

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
