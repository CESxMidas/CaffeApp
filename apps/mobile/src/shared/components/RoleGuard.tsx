import { useEffect, type ReactNode } from 'react';
import { router } from 'expo-router';
import type { Role } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

interface RoleGuardProps {
  allowed: Role[];
  children: ReactNode;
}

/** Redirect to root if activeRole is not in allowed list (UX guard — not security). */
export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const activeRole = useSessionStore((s) => s.activeRole);
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !activeRole || !allowed.includes(activeRole)) {
      router.replace('/');
    }
  }, [activeRole, allowed, isAuthenticated, isHydrated]);

  if (!isHydrated || !activeRole || !allowed.includes(activeRole)) {
    return null;
  }

  return children;
}
