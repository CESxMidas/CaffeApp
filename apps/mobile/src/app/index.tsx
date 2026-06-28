import { Redirect } from 'expo-router';
import { StaffRole } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

export default function Index() {
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const activeRole = useSessionStore((s) => s.activeRole);
  const accessToken = useSessionStore((s) => s.accessToken);
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const staffRole = useSessionStore((s) => s.staffRole);

  if (!isHydrated) {
    return null;
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!isAuthenticated) {
    if (staffRole === StaffRole.OWNER && !activeBranchId) {
      return <Redirect href="/(auth)/branch" />;
    }
    if (!activeBranchId) {
      return <Redirect href="/(auth)/login" />;
    }
    return <Redirect href="/(auth)/role" />;
  }

  switch (activeRole) {
    case 'cashier':
      return <Redirect href="/(cashier)/(tabs)/home" />;
    case 'barista':
      return <Redirect href="/(barista)/(tabs)/queue" />;
    case 'manager':
      return <Redirect href="/(manager)/dashboard" />;
    default:
      return <Redirect href="/(auth)/role" />;
  }
}
