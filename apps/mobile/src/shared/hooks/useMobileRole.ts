import { STAFF_ROLE_TO_MOBILE_ROLE, type Role, type StaffRole } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

/** UX routing role derived from API StaffRole (C-11). */
export function useMobileRole(): Role | null {
  const staffRole = useSessionStore((s) => s.staffRole) as StaffRole | null;
  const activeRole = useSessionStore((s) => s.activeRole);

  if (staffRole) {
    return STAFF_ROLE_TO_MOBILE_ROLE[staffRole];
  }

  return activeRole;
}
