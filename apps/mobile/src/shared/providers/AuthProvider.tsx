import { useEffect, type ReactNode } from 'react';
import { StaffRole, BranchAssignmentStatus } from '@caffeapp/shared';
import { setApiAccessToken } from '@shared/lib/api';
import { loadPersistedSession } from '@shared/lib/storage';
import { useSessionStore } from '@shared/stores/session';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const activateSession = useSessionStore((s) => s.activateSession);
  const setLoginResult = useSessionStore((s) => s.setLoginResult);
  const setBranch = useSessionStore((s) => s.setBranch);
  const setHydrated = useSessionStore((s) => s.setHydrated);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const persisted = await loadPersistedSession();
        if (!mounted || !persisted) {
          return;
        }

        const staffRole = persisted.staffRole ?? StaffRole.CASHIER;

        setApiAccessToken(persisted.accessToken);
        setLoginResult({
          accessToken: persisted.accessToken,
          refreshToken: persisted.refreshToken,
          expiresIn: 0,
          user: {
            id: '',
            email: '',
            fullName: persisted.employeeName ?? '',
          },
          staff: {
            id: persisted.staffId ?? '',
            userId: '',
            branchId: persisted.activeBranchId,
            role: staffRole,
            fullName: persisted.employeeName ?? '',
            isActive: true,
            branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
            isStationAccount: persisted.isStationDevice,
          },
          branch:
            persisted.activeBranchId && persisted.activeBranchName
              ? {
                  id: persisted.activeBranchId,
                  name: persisted.activeBranchName,
                  address: null,
                  phone: null,
                  isActive: true,
                }
              : null,
        });

        if (persisted.activeBranchId && persisted.activeBranchName) {
          setBranch(persisted.activeBranchId, persisted.activeBranchName);
        }

        if (
          persisted.activeBranchId &&
          persisted.activeBranchName &&
          persisted.employeeName &&
          persisted.staffRole
        ) {
          activateSession({
            branchId: persisted.activeBranchId,
            branchName: persisted.activeBranchName,
            staffRole: persisted.staffRole,
            employeeName: persisted.employeeName,
          });
        }
      } catch {
        // Storage unavailable or corrupt — treat as logged out
      } finally {
        if (mounted) {
          setHydrated();
        }
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [activateSession, setBranch, setHydrated, setLoginResult]);

  return children;
}
