import { useEffect, type ReactNode } from 'react';
import { router } from 'expo-router';
import { useSessionStore } from '@shared/stores/session';

interface StationGuardProps {
  children: ReactNode;
}

/** Only shared tablet station sessions may access `(station)/` routes. */
export function StationGuard({ children }: StationGuardProps) {
  const isStationDevice = useSessionStore((s) => s.isStationDevice);
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated || !isStationDevice) {
      router.replace('/');
    }
  }, [isStationDevice, isAuthenticated, isHydrated]);

  if (!isHydrated || !isAuthenticated || !isStationDevice) {
    return null;
  }

  return children;
}
