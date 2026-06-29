import { Redirect } from 'expo-router';
import { StaffRole } from '@caffeapp/shared';
import { routeHrefAfterSession } from '@shared/lib/navigation/operationalRoutes';
import { useSessionStore } from '@shared/stores/session';

export default function Index() {
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
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
    if (staffRole && staffRole !== StaffRole.OWNER && !activeBranchId) {
      return <Redirect href="/(auth)/pending-branch" />;
    }
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={routeHrefAfterSession()} />;
}
