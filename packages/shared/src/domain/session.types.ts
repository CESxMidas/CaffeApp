import { StaffRole } from '../enums';

/**
 * Mobile session role — UI routing subset of StaffRole.
 * @deprecated Prefer StaffRole + STAFF_ROLE_TO_MOBILE_ROLE at API boundary.
 */
export type Role = 'cashier' | 'barista' | 'manager';

export const STAFF_ROLE_TO_MOBILE_ROLE: Record<
  StaffRole.CASHIER | StaffRole.BARISTA | StaffRole.MANAGER | StaffRole.OWNER,
  Role
> = {
  [StaffRole.CASHIER]: 'cashier',
  [StaffRole.BARISTA]: 'barista',
  [StaffRole.MANAGER]: 'manager',
  [StaffRole.OWNER]: 'manager',
};

export const MOBILE_ROLE_TO_STAFF_ROLE: Record<Role, StaffRole> = {
  cashier: StaffRole.CASHIER,
  barista: StaffRole.BARISTA,
  manager: StaffRole.MANAGER,
};
