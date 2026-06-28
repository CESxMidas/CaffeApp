import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from '@prisma/client';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

class CreateOrderItemBodyDto {
  @IsEntityId()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @IsEntityId()
  branchId!: string;

  @IsEnum(OrderType)
  orderType!: OrderType;

  @IsOptional()
  @IsEntityId()
  tableId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemBodyDto)
  items!: CreateOrderItemBodyDto[];
}
