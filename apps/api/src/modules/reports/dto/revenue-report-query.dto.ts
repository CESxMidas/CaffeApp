import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class RevenueReportQueryDto {
  @IsOptional()
  @IsEntityId()
  branchId?: string;

  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsOptional()
  @IsIn(['day', 'week', 'month'])
  groupBy?: 'day' | 'week' | 'month';
}
