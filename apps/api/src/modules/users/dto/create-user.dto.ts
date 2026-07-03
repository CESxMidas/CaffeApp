import { StaffRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(StaffRole)
  role!: StaffRole;

  @IsEntityId()
  @IsOptional()
  branchId?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}