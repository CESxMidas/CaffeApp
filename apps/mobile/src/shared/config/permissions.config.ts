import type { Role } from '@caffeapp/shared';

/** UX-only permission gates — API enforces real RBAC via JWT StaffRole. */
export const PERMISSIONS = {
  'orders:create': ['cashier', 'manager'],
  'orders:pay': ['cashier', 'manager'],
  'payments:void': ['manager'],
  'orders:cancel': ['cashier', 'manager'],
  'orders:status': ['cashier', 'barista', 'manager'],
  'orders:queue:view': ['barista', 'manager'],
  'orders:list': ['cashier', 'manager'],
  'tables:view': ['cashier', 'manager'],
  'menu:view': ['cashier', 'barista', 'manager'],
  'menu:manage': ['manager'],
  'tables:manage': ['manager'],
  'reports:view': ['manager'],
  'inventory:manage': ['manager'],
  'staff:manage': ['manager'],
  'users:create': ['manager'],
  'branches:manage': ['manager'],
} as const satisfies Record<string, readonly Role[]>;

export type PermissionAction = keyof typeof PERMISSIONS;

export function canPerform(activeRole: Role | null, action: PermissionAction): boolean {
  if (!activeRole) return false;
  return (PERMISSIONS[action] as readonly Role[]).includes(activeRole);
}
