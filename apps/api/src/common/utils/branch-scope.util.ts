import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { StaffRole } from '@prisma/client';
import type { JwtPayload } from '@common/types/jwt-payload.types';

/**
 * Resolve branch scope for list/detail queries.
 * - OWNER: must pass explicit branchId (query or body).
 * - Others: locked to JWT branchId; rejects cross-branch access.
 */
export function resolveBranchScope(payload: JwtPayload, requestedBranchId?: string): string {
  if (payload.role === StaffRole.OWNER) {
    if (!requestedBranchId) {
      throw new BadRequestException('branchId is required for this operation');
    }
    return requestedBranchId;
  }

  if (!payload.branchId) {
    throw new ForbiddenException('Staff is not assigned to a branch');
  }

  if (requestedBranchId && requestedBranchId !== payload.branchId) {
    throw new ForbiddenException('Access denied for this branch');
  }

  return payload.branchId;
}

/** Assert a resource belongs to the user's branch scope. */
export function assertBranchAccess(payload: JwtPayload, resourceBranchId: string): void {
  if (payload.role === StaffRole.OWNER) {
    return;
  }
  if (payload.branchId !== resourceBranchId) {
    throw new ForbiddenException('Access denied for this branch');
  }
}
