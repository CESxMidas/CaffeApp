import { Redirect } from 'expo-router';
import { useSessionStore } from '@shared/stores/session';

export default function Index() {
  const { isAuthenticated, activeRole } = useSessionStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  switch (activeRole) {
    case 'cashier':
      return <Redirect href="/(cashier)/(tabs)/home" />;
    case 'barista':
      return <Redirect href="/(barista)/queue" />;
    case 'manager':
      return <Redirect href="/(manager)/dashboard" />;
    default:
      return <Redirect href="/(auth)/role" />;
  }
}
