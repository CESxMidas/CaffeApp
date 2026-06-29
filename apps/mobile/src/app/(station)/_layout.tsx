import { Stack } from 'expo-router';
import { colors } from '@caffeapp/shared';
import { HeaderBackButton } from '@shared/components/HeaderBackButton';
import { StationGuard } from '@shared/components/StationGuard';

const backScreen = (title: string) => ({
  title,
  headerLeft: () => <HeaderBackButton />,
});

export default function StationLayout() {
  return (
    <StationGuard>
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
        <Stack.Screen
          name="kitchen/order/[id]"
          options={{
            title: 'Chi tiết đơn bếp',
            headerLeft: () => <HeaderBackButton />,
          }}
        />
      </Stack>
    </StationGuard>
  );
}
