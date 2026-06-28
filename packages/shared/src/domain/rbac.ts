import { StaffRole } from '../enums';
import type { Role } from './session.types';

/** Role tiers matching API_CONTRACT §1.5 */
export const ROLE_TIERS = {
  CASHIER_PLUS: [StaffRole.CASHIER, StaffRole.MANAGER, StaffRole.OWNER] as const,
  BARISTA_PLUS: [StaffRole.BARISTA, StaffRole.MANAGER, StaffRole.OWNER] as const,
  MANAGER_PLUS: [StaffRole.MANAGER, StaffRole.OWNER] as const,
  OWNER_ONLY: [StaffRole.OWNER] as const,
  AUTHENTICATED: [
    StaffRole.CASHIER,
    StaffRole.BARISTA,
    StaffRole.MANAGER,
    StaffRole.OWNER,
  ] as const,
} as const;

export type RoleTier = keyof typeof ROLE_TIERS;

export function isStaffRoleInTier(role: StaffRole, tier: RoleTier): boolean {
  return (ROLE_TIERS[tier] as readonly StaffRole[]).includes(role);
}

export function isOwnerStaffRole(role: StaffRole | null | undefined): boolean {
  return role === StaffRole.OWNER;
}

/** Mobile role cards allowed after login, by canonical StaffRole. */
export function rolesForStaff(staffRole: StaffRole | null | undefined): Role[] {
  switch (staffRole) {
    case StaffRole.CASHIER:
      return ['cashier'];
    case StaffRole.BARISTA:
      return ['barista'];
    case StaffRole.MANAGER:
    case StaffRole.OWNER:
      return ['cashier', 'barista', 'manager'];
    default:
      return [];
  }
}
