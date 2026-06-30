import { useEffect, type ReactNode } from 'react';

import { router } from 'expo-router';

import type { Role } from '@caffeapp/shared';

import { useMobileRole } from '@shared/hooks/useMobileRole';

import { useSessionStore } from '@shared/stores/session';

interface RoleGuardProps {
  allowed: Role[];

  children: ReactNode;
}

/** Redirect to root if StaffRole-derived route is not in allowed list (UX guard). */

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const mobileRole = useMobileRole();

  const isStationDevice = useSessionStore((s) => s.isStationDevice);

  const isHydrated = useSessionStore((s) => s.isHydrated);

  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;

    if (isStationDevice && isAuthenticated && allowed.includes('cashier')) {
      router.replace('/(station)/(tabs)/front/home');

      return;
    }

    if (!isAuthenticated || !mobileRole || !allowed.includes(mobileRole)) {
      router.replace('/');
    }
  }, [mobileRole, allowed, isAuthenticated, isHydrated, isStationDevice]);

  if (!isHydrated) {
    return null;
  }

  if (isStationDevice && allowed.includes('cashier')) {
    return null;
  }

  if (!isAuthenticated || !mobileRole || !allowed.includes(mobileRole)) {
    return null;
  }

  return children;
}
