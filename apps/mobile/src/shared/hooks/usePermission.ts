import { StaffRole } from '@caffeapp/shared';
import { canPerform, type PermissionAction } from '@shared/config/permissions.config';
import { useMobileRole } from '@shared/hooks/useMobileRole';
import { useSessionStore } from '@shared/stores/session';

export function usePermission(action: PermissionAction): boolean {
  const mobileRole = useMobileRole();
  return canPerform(mobileRole, action);
}

export function useIsOwner(): boolean {
  const staffRole = useSessionStore((s) => s.staffRole);
  return staffRole === StaffRole.OWNER;
}
