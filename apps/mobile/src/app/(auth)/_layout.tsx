import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: '' }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="branch" options={{ title: 'Chọn chi nhánh' }} />
      <Stack.Screen name="role" options={{ title: 'Chọn vai trò' }} />
    </Stack>
  );
}
