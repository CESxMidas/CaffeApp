import { Stack } from 'expo-router';
import { colors } from '@caffeapp/shared';
import { HeaderBackButton } from '@shared/components/HeaderBackButton';
import { RoleGuard } from '@shared/components/RoleGuard';

export default function BaristaLayout() {
  return (
    <RoleGuard allowed={['barista', 'manager']}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="order/[id]"
          options={{
            title: 'Chi tiết đơn',
            headerLeft: () => <HeaderBackButton />,
          }}
        />
      </Stack>
    </RoleGuard>
  );
}
