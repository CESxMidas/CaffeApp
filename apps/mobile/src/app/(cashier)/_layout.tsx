import { Stack } from 'expo-router';
import { colors } from '@caffeapp/shared';

export default function CashierLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="order-type" options={{ title: 'Chọn loại đơn' }} />
    </Stack>
  );
}
