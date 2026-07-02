import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

class SplitOrderItemBodyDto {
  @IsEntityId()
  itemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class SplitOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SplitOrderItemBodyDto)
  items!: SplitOrderItemBodyDto[];

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
