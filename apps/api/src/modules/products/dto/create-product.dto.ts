import { IsString, IsInt, IsOptional, IsBoolean, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'categoryId là bắt buộc' })
  @IsString()
  categoryId!: string;

  @IsNotEmpty({ message: 'name là bắt buộc' })
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'price là bắt buộc' })
  @IsInt()
  @Min(0, { message: 'price phải là số dương' })
  price!: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
