import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { TableStatus } from '@prisma/client';

export class UpdateTableStatusDto {
  @IsNotEmpty({ message: 'status là bắt buộc' })
  @IsEnum(TableStatus, { message: 'status phải là một trong: EMPTY, OCCUPIED, MAINTENANCE' })
  status!: TableStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
