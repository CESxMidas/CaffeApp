import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@caffeapp/shared';
import { QueryProvider } from '@shared/providers/QueryProvider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="dark" />
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
        <Stack.Screen name="(barista)" options={{ headerShown: false }} />
        <Stack.Screen name="(manager)" options={{ headerShown: false }} />
      </Stack>
    </QueryProvider>
  );
}
