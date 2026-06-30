import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { OrderStatus, colors, formatCurrency, spacing } from '@caffeapp/shared';
import { useOrders } from '@features/orders';
import { opStack } from '@shared/lib/navigation/operationalRoutes';
import { Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';

export default function CashierHistoryScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useOrders({
    branchId: activeBranchId,
    status: OrderStatus.PAID,
  });

  const sorted = useMemo(
    () => [...(orders ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được lịch sử" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử hôm nay</Text>
      {sorted.length === 0 ? (
        <EmptyState icon="time-outline" title="Chưa có đơn đã thanh toán" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        >
          {sorted.map((order) => (
            <Pressable key={order.id} onPress={() => router.push(opStack(`/order/${order.id}`))}>
              <Card style={styles.row}>
                <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                <Text style={styles.meta}>
                  {new Date(order.createdAt).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · {formatCurrency(order.total)}
                </Text>
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  list: { gap: spacing.sm, paddingBottom: spacing.xl },
  row: {},
  orderNumber: { fontSize: 15, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});
