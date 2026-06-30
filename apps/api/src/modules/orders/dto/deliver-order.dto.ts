import { IsOptional } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class DeliverOrderDto {
  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
