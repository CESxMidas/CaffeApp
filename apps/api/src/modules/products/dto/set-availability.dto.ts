import { IsBoolean } from 'class-validator';

export class SetAvailabilityDto {
  @IsBoolean({ message: 'isAvailable phải là boolean' })
  isAvailable!: boolean;
}
