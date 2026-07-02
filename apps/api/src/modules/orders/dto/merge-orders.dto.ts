import { ArrayMinSize, IsArray, IsOptional } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class MergeOrdersDto {
  @IsEntityId()
  targetOrderId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEntityId({ each: true })
  sourceOrderIds!: string[];

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
