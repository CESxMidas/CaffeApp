import { router } from 'expo-router';
import type { LoginResponseDto } from '@caffeapp/shared';
import { StaffRole } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';
import { activateAndNavigate, staffHasApprovedBranch } from './sessionRouting';

/**
 * After login: route by canonical StaffRole (C-11). No role picker screen.
 * OWNER selects operational branch; staff use manager-approved assignment.
 */
export function navigateAfterLogin(data: LoginResponseDto): void {
  const setBranch = useSessionStore.getState().setBranch;

  if (data.staff.role === StaffRole.OWNER) {
    router.replace('/(auth)/branch');
    return;
  }

  if (!staffHasApprovedBranch(data) || !data.branch) {
    router.replace('/(auth)/pending-branch');
    return;
  }

  setBranch(data.branch.id, data.branch.name);
  void activateAndNavigate({
    branchId: data.branch.id,
    branchName: data.branch.name,
    staffRole: data.staff.role,
    employeeName: data.user.fullName,
  });
}
