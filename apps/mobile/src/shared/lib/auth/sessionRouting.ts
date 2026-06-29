import { router, type Href } from 'expo-router';
import {
  BranchAssignmentStatus,
  StaffRole,
  STAFF_ROLE_TO_MOBILE_ROLE,
  type LoginResponseDto,
  type Role,
} from '@caffeapp/shared';
import { saveSessionContext } from '@shared/lib/storage';
import { routeHrefAfterSession } from '@shared/lib/navigation/operationalRoutes';
import { useSessionStore } from '@shared/stores/session';
export function mobileRoleForStaff(staffRole: StaffRole): Role {
  return STAFF_ROLE_TO_MOBILE_ROLE[staffRole];
}

export function routeHrefForMobileRole(role: Role): Href {
  switch (role) {
    case 'cashier':
      return '/(cashier)/(tabs)/home';
    case 'barista':
      return '/(barista)/(tabs)/queue';
    case 'manager':
      return '/(manager)/dashboard';
  }
}

export function staffHasApprovedBranch(data: LoginResponseDto): boolean {
  if (data.staff.role === StaffRole.OWNER) {
    return true;
  }
  if (data.staff.branchAssignmentStatus !== BranchAssignmentStatus.APPROVED) {
    return false;
  }
  return Boolean(data.branch?.id && data.staff.branchId);
}

export async function activateStaffSession(params: {
  branchId: string;
  branchName: string;
  staffRole: StaffRole;
  employeeName: string;
}): Promise<Role> {
  const mobileRole = mobileRoleForStaff(params.staffRole);
  const { staffId, isStationDevice } = useSessionStore.getState();

  await saveSessionContext({
    activeBranchId: params.branchId,
    activeBranchName: params.branchName,
    activeRole: mobileRole,
    staffRole: params.staffRole,
    staffId: staffId ?? '',
    isStationDevice,
    employeeName: params.employeeName,
  });

  useSessionStore.getState().activateSession({
    branchId: params.branchId,
    branchName: params.branchName,
    staffRole: params.staffRole,
    employeeName: params.employeeName,
  });

  return mobileRole;
}

export async function activateAndNavigate(params: {
  branchId: string;
  branchName: string;
  staffRole: StaffRole;
  employeeName: string;
}): Promise<void> {
  await activateStaffSession(params);
  router.replace(routeHrefAfterSession());
}
