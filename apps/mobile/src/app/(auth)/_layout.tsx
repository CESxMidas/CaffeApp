import { Stack } from 'expo-router';
import { HeaderBackButton } from '@shared/components/HeaderBackButton';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: '' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="branch"
        options={{ title: 'Chọn chi nhánh', headerLeft: () => <HeaderBackButton /> }}
      />
      <Stack.Screen
        name="role"
        options={{ title: 'Chọn vai trò', headerLeft: () => <HeaderBackButton /> }}
      />
    </Stack>
  );
}
