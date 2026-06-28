import type { Role } from '@caffeapp/shared';
import { colors } from '@caffeapp/shared';
import { create } from 'zustand';

/**
 * Local UI + auth session state only.
 * Server data must use TanStack Query via services layer.
 */
interface SessionState {
  isAuthenticated: boolean;
  accessToken: string | null;
  activeBranchId: string | null;
  activeRole: Role | null;
  employeeName: string | null;
  setSession: (params: {
    branchId: string;
    role: Role;
    name: string;
    accessToken?: string;
  }) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  activeBranchId: null,
  activeRole: null,
  employeeName: null,
  setSession: ({ branchId, role, name, accessToken }) =>
    set({
      isAuthenticated: true,
      activeBranchId: branchId,
      activeRole: role,
      employeeName: name,
      accessToken: accessToken ?? null,
    }),
  clearSession: () =>
    set({
      isAuthenticated: false,
      accessToken: null,
      activeBranchId: null,
      activeRole: null,
      employeeName: null,
    }),
}));

export const useTheme = () => ({ colors });
