import { IsString, MaxLength, MinLength } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  reason!: string;
}
