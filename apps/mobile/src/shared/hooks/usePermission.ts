import { canPerform, type PermissionAction } from '@shared/config/permissions.config';
import { useSessionStore } from '@shared/stores/session';

export function usePermission(action: PermissionAction): boolean {
  const activeRole = useSessionStore((s) => s.activeRole);
  return canPerform(activeRole, action);
}

export function useIsOwner(): boolean {
  return useSessionStore((s) => s.isOwner);
}
