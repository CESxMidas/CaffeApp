import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class CancelOrderDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  reason!: string;

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
