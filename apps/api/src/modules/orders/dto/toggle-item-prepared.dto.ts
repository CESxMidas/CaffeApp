import { IsBoolean, IsOptional } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class ToggleItemPreparedDto {
  @IsBoolean()
  isPrepared!: boolean;

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
