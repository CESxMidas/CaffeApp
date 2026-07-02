import { IsString, IsInt, IsOptional, IsBoolean, Min, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'name là bắt buộc' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'slug là bắt buộc' })
  @IsString()
  slug!: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'sortOrder phải là số dương' })
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
