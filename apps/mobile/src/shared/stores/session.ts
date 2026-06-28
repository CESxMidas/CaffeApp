import type { LoginResponseDto, Role, StaffRole } from '@caffeapp/shared';
import { isOwnerStaffRole } from '@caffeapp/shared';
import { create } from 'zustand';

interface SessionState {
  isAuthenticated: boolean;
  isHydrated: boolean;
  isOwner: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  staffRole: StaffRole | null;
  activeBranchId: string | null;
  activeBranchName: string | null;
  activeRole: Role | null;
  employeeName: string | null;
  setHydrated: () => void;
  setLoginResult: (result: LoginResponseDto) => void;
  setBranch: (branchId: string, branchName: string) => void;
  completeSession: (params: {
    branchId: string;
    branchName: string;
    role: Role;
    name: string;
  }) => void;
  clearSession: () => void;
}

const initialState = {
  isAuthenticated: false,
  isHydrated: false,
  isOwner: false,
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
      isOwner: isOwnerStaffRole(result.staff.role),
      employeeName: result.user.fullName,
    }),
  setBranch: (branchId, branchName) =>
    set({ activeBranchId: branchId, activeBranchName: branchName }),
  completeSession: ({ branchId, branchName, role, name }) =>
    set({
      isAuthenticated: true,
      activeBranchId: branchId,
      activeBranchName: branchName,
      activeRole: role,
      employeeName: name,
    }),
  clearSession: () => set({ ...initialState, isHydrated: true }),
}));
