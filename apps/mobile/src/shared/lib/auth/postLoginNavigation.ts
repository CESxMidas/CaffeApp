import { router } from 'expo-router';
import type { LoginResponseDto } from '@caffeapp/shared';
import { StaffRole } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

/**
 * After login: staff never pick branch — use manager/owner-approved assignment.
 * Only OWNER selects operational branch for the session.
 */
export function navigateAfterLogin(data: LoginResponseDto): void {
  const setBranch = useSessionStore.getState().setBranch;

  if (data.staff.role === StaffRole.OWNER) {
    router.replace('/(auth)/branch');
    return;
  }

  if (data.branch) {
    setBranch(data.branch.id, data.branch.name);
    router.replace('/(auth)/role');
    return;
  }

  router.replace('/(auth)/login');
}
