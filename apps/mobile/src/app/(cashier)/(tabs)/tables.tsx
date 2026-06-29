import { useCallback } from 'react';
import { View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { OrderType, colors } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';
import { useCartStore } from '@shared/stores/cart';
import { opStack } from '@shared/lib/navigation/operationalRoutes';

/** Tab "Bàn" — mở sơ đồ bàn full-screen (design bottom nav) */
export default function CashierTablesTabScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const startOrder = useCartStore((s) => s.startOrder);

  useFocusEffect(
    useCallback(() => {
      if (activeBranchId) {
        startOrder({ branchId: activeBranchId, orderType: OrderType.DINE_IN });
      }
      router.push(opStack('/tables'));
    }, [activeBranchId, startOrder]),
  );

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
