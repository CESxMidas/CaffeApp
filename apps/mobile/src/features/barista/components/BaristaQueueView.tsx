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
import type { OrderDto } from '@caffeapp/shared';
import { OrderStatus, ORDER_STATUS_LABELS, OrderType, colors, spacing } from '@caffeapp/shared';
import { useBaristaQueue } from '../hooks';
import { Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { opKitchenOrder } from '@shared/lib/navigation/operationalRoutes';

const QUEUE_STATUSES = [OrderStatus.PENDING, OrderStatus.MAKING, OrderStatus.READY] as const;

const STATUS_COLORS: Record<(typeof QUEUE_STATUSES)[number], string> = {
  [OrderStatus.PENDING]: colors.warning,
  [OrderStatus.MAKING]: colors.accent,
  [OrderStatus.READY]: colors.primary,
};

export function BaristaQueueView() {
  const { data: orders, isLoading, isError, refetch, isRefetching } = useBaristaQueue();

  const grouped = useMemo(() => {
    const map = new Map<OrderStatus, OrderDto[]>();
    for (const status of QUEUE_STATUSES) {
      map.set(status, []);
    }
    for (const order of orders ?? []) {
      if (QUEUE_STATUSES.includes(order.status as (typeof QUEUE_STATUSES)[number])) {
        map.get(order.status as OrderStatus)?.push(order);
      }
    }
    return map;
  }, [orders]);

  const totalCount = orders?.length ?? 0;

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
        <ErrorScreen message="Không tải được hàng đợi bếp" onRetry={() => refetch()} />
      </View>
    );
  }

  if (totalCount === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="cafe-outline"
          title="Không có đơn chờ"
          subtitle="Tất cả đơn đã được xử lý xong"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
    >
      {QUEUE_STATUSES.map((status) => {
        const sectionOrders = grouped.get(status) ?? [];
        if (sectionOrders.length === 0) return null;

        return (
          <View key={status} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status] }]} />
              <Text style={styles.sectionTitle}>
                {ORDER_STATUS_LABELS[status]} ({sectionOrders.length})
              </Text>
            </View>
            {sectionOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

function OrderCard({ order }: { order: OrderDto }) {
  const typeLabel = order.orderType === OrderType.DINE_IN ? 'Tại bàn' : 'Mang đi';

  return (
    <Pressable onPress={() => router.push(opKitchenOrder(order.id))}>
      <Card style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.orderType}>{typeLabel}</Text>
        </View>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemQty}>{item.quantity}x</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productName}</Text>
              {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
            </View>
          </View>
        ))}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  orderCard: { marginBottom: spacing.sm },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: { fontSize: 16, fontWeight: '700', color: colors.text },
  orderType: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  itemRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  itemQty: { fontSize: 15, fontWeight: '700', color: colors.primary, minWidth: 28 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, color: colors.text },
  itemNotes: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
