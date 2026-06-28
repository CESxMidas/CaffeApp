import { IsEntityId } from '@common/validators/is-entity-id.decorator';

export class ProposeBranchAssignmentDto {
  @IsEntityId()
  branchId!: string;
}
