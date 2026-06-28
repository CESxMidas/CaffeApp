import { useMemo, useState } from 'react';
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
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  colors,
  formatCurrency,
  spacing,
  borderRadius,
} from '@caffeapp/shared';
import { useOrders } from '@features/orders';
import { Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';

const TABS = [
  { key: 'all', label: 'Tất cả', statuses: null },
  {
    key: 'active',
    label: 'Đang pha',
    statuses: [OrderStatus.PENDING, OrderStatus.MAKING],
  },
  { key: 'ready', label: 'Sẵn sàng giao', statuses: [OrderStatus.READY] },
  { key: 'serving', label: 'Chờ thanh toán', statuses: [OrderStatus.SERVING] },
  { key: 'done', label: 'Hoàn thành', statuses: [OrderStatus.PAID] },
] as const;

export default function CashierOrdersScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');
  const { data: orders, isLoading, isError, refetch, isRefetching } = useOrders({
    branchId: activeBranchId,
  });

  const filtered = useMemo(() => {
    const current = TABS.find((t) => t.key === tab);
    if (!current?.statuses) return orders ?? [];
    return (orders ?? []).filter((o) =>
      (current.statuses as readonly OrderStatus[]).includes(o.status as OrderStatus),
    );
  }, [orders, tab]);

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
        <ErrorScreen message="Không tải được danh sách đơn" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)}>
            <View style={[styles.tab, tab === t.key && styles.tabActive]}>
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState icon="receipt-outline" title="Chưa có đơn" subtitle="Đơn mới sẽ hiện ở đây" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        >
          {filtered.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function OrderRow({ order }: { order: OrderDto }) {
  return (
    <Pressable onPress={() => router.push(`/(cashier)/order/${order.id}` as never)}>
      <Card style={styles.rowCard}>
        <View style={styles.rowHeader}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{ORDER_STATUS_LABELS[order.status]}</Text>
          </View>
        </View>
        <Text style={styles.rowMeta}>
          {order.items.length} món · {formatCurrency(order.total)}
        </Text>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabs: { maxHeight: 48, paddingHorizontal: spacing.base, marginVertical: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tabText: { fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  list: { padding: spacing.base, paddingBottom: spacing.xl, gap: spacing.sm },
  rowCard: {},
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: 16, fontWeight: '700', color: colors.text },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  rowMeta: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
});
