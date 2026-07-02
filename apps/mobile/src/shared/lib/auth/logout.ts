import { router } from 'expo-router';
import { disconnectOrderSocket, setApiAccessToken } from '@shared/lib/api';
import { clearPersistedSession } from '@shared/lib/storage';
import { useSessionStore } from '@shared/stores/session';

/** Clear memory + persisted tokens and return to login. */
export async function logout(): Promise<void> {
  disconnectOrderSocket();
  await clearPersistedSession();
  setApiAccessToken(null);
  useSessionStore.getState().clearSession();
  router.replace('/(auth)/login');
}
