import { IsBoolean, IsOptional } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class TransferOrderTableDto {
  @IsEntityId()
  tableId!: string;

  @IsOptional()
  @IsBoolean()
  mergeIntoOccupied?: boolean;

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
