import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { Role, StaffRole } from '@caffeapp/shared';

const KEYS = {
  ACCESS_TOKEN: 'caffeapp_access_token',
  REFRESH_TOKEN: 'caffeapp_refresh_token',
  ACTIVE_BRANCH_ID: 'caffeapp_active_branch_id',
  ACTIVE_BRANCH_NAME: 'caffeapp_active_branch_name',
  ACTIVE_ROLE: 'caffeapp_active_role',
  STAFF_ROLE: 'caffeapp_staff_role',
  EMPLOYEE_NAME: 'caffeapp_employee_name',
} as const;

/** SecureStore is native-only; web dev uses localStorage fallback. */
const useSecureStore = Platform.OS !== 'web';

async function setItem(key: string, value: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (useSecureStore) {
    return SecureStore.getItemAsync(key);
  }
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

async function deleteItem(key: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export interface PersistedSession {
  accessToken: string;
  refreshToken: string;
  activeBranchId: string | null;
  activeBranchName: string | null;
  activeRole: Role | null;
  staffRole: StaffRole | null;
  employeeName: string | null;
}

export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await setItem(KEYS.ACCESS_TOKEN, accessToken);
  await setItem(KEYS.REFRESH_TOKEN, refreshToken);
}

export async function saveStaffRole(staffRole: StaffRole): Promise<void> {
  await setItem(KEYS.STAFF_ROLE, staffRole);
}

export async function saveSessionContext(params: {
  activeBranchId: string;
  activeBranchName: string;
  activeRole: Role;
  staffRole: StaffRole;
  employeeName: string;
}): Promise<void> {
  await setItem(KEYS.ACTIVE_BRANCH_ID, params.activeBranchId);
  await setItem(KEYS.ACTIVE_BRANCH_NAME, params.activeBranchName);
  await setItem(KEYS.ACTIVE_ROLE, params.activeRole);
  await setItem(KEYS.STAFF_ROLE, params.staffRole);
  await setItem(KEYS.EMPLOYEE_NAME, params.employeeName);
}

export async function loadPersistedSession(): Promise<PersistedSession | null> {
  const accessToken = await getItem(KEYS.ACCESS_TOKEN);
  const refreshToken = await getItem(KEYS.REFRESH_TOKEN);
  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    activeBranchId: (await getItem(KEYS.ACTIVE_BRANCH_ID)) ?? null,
    activeBranchName: (await getItem(KEYS.ACTIVE_BRANCH_NAME)) ?? null,
    activeRole: (await getItem(KEYS.ACTIVE_ROLE)) as Role | null,
    staffRole: (await getItem(KEYS.STAFF_ROLE)) as StaffRole | null,
    employeeName: (await getItem(KEYS.EMPLOYEE_NAME)) ?? null,
  };
}

export async function clearPersistedSession(): Promise<void> {
  await Promise.all(Object.values(KEYS).map((key) => deleteItem(key)));
}
