import { IsEntityId } from '@common/validators/is-entity-id.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class OpenShiftDto {
  @IsEntityId()
  branchId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  shiftType!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;
}

export class CloseShiftDto {
  @IsEntityId()
  shiftId!: string;
}
