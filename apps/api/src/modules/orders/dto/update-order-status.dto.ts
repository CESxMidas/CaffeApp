import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsEntityId()
  actedByStaffId?: string;
}
