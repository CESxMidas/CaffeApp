import type { LoginResponseDto, StaffRole, Role } from '@caffeapp/shared';

import { STAFF_ROLE_TO_MOBILE_ROLE, isOwnerStaffRole } from '@caffeapp/shared';

import { create } from 'zustand';

interface SessionState {
  isAuthenticated: boolean;

  isHydrated: boolean;

  isOwner: boolean;

  isStationDevice: boolean;

  staffId: string | null;

  accessToken: string | null;

  refreshToken: string | null;

  staffRole: StaffRole | null;

  activeBranchId: string | null;

  activeBranchName: string | null;

  /** @deprecated Derived from staffRole — kept for SecureStore migration */

  activeRole: Role | null;

  employeeName: string | null;

  setHydrated: () => void;

  setLoginResult: (result: LoginResponseDto) => void;

  setBranch: (branchId: string, branchName: string) => void;

  activateSession: (params: {
    branchId: string;

    branchName: string;

    staffRole: StaffRole;

    employeeName: string;
  }) => void;

  clearSession: () => void;
}

const initialState = {
  isAuthenticated: false,

  isHydrated: false,

  isOwner: false,

  isStationDevice: false,

  staffId: null,

  accessToken: null,

  refreshToken: null,

  staffRole: null,

  activeBranchId: null,

  activeBranchName: null,

  activeRole: null,

  employeeName: null,
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,

  setHydrated: () => set({ isHydrated: true }),

  setLoginResult: (result) =>
    set({
      accessToken: result.accessToken,

      refreshToken: result.refreshToken,

      staffRole: result.staff.role,

      staffId: result.staff.id,

      isStationDevice: result.staff.isStationAccount === true,

      isOwner: isOwnerStaffRole(result.staff.role),

      employeeName: result.user.fullName,
    }),

  setBranch: (branchId, branchName) =>
    set({ activeBranchId: branchId, activeBranchName: branchName }),

  activateSession: ({ branchId, branchName, staffRole, employeeName }) =>
    set({
      isAuthenticated: true,

      activeBranchId: branchId,

      activeBranchName: branchName,

      staffRole,

      employeeName,

      activeRole: STAFF_ROLE_TO_MOBILE_ROLE[staffRole],

      isOwner: isOwnerStaffRole(staffRole),
    }),

  clearSession: () => set({ ...initialState, isHydrated: true }),
}));
