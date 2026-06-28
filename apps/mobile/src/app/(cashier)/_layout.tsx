import { Stack } from 'expo-router';
import { colors } from '@caffeapp/shared';
import { HeaderBackButton } from '@shared/components/HeaderBackButton';
import { RoleGuard } from '@shared/components/RoleGuard';

const backScreen = (title: string) => ({
  title,
  headerLeft: () => <HeaderBackButton />,
});

export default function CashierLayout() {
  return (
    <RoleGuard allowed={['cashier', 'manager']}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="order-type" options={backScreen('Chọn loại đơn')} />
        <Stack.Screen name="tables" options={backScreen('Sơ đồ bàn')} />
        <Stack.Screen name="menu" options={backScreen('Chọn món')} />
        <Stack.Screen name="cart" options={backScreen('Giỏ hàng')} />
        <Stack.Screen name="history" options={backScreen('Lịch sử đơn')} />
        <Stack.Screen name="order/[id]" options={backScreen('Chi tiết đơn')} />
        <Stack.Screen name="payment/[orderId]" options={backScreen('Thanh toán')} />
        <Stack.Screen name="notifications" options={backScreen('Thông báo')} />
      </Stack>
    </RoleGuard>
  );
}
