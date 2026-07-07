import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@caffeapp/shared';
import { OfflineBanner, ToastHost } from '@shared/components/ui';
import { AuthProvider } from '@shared/providers/AuthProvider';
import { QueryProvider } from '@shared/providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <OfflineBanner />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '600' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(cashier)" options={{ headerShown: false }} />
          <Stack.Screen name="(station)" options={{ headerShown: false }} />
          <Stack.Screen name="(barista)" options={{ headerShown: false }} />
          <Stack.Screen name="(manager)" options={{ headerShown: false }} />
        </Stack>
        <ToastHost />
      </AuthProvider>
    </QueryProvider>
  );
}
