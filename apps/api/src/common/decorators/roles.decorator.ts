import { SetMetadata } from '@nestjs/common';
import type { StaffRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/** Require JWT `StaffRole` to be one of the listed roles (or use ROLE_TIERS spread). */
export const Roles = (...roles: StaffRole[]) => SetMetadata(ROLES_KEY, roles);
