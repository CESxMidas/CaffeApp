import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  OrderType,
  colors,
  formatCurrency,
  spacing,
  StaffRole,
} from '@caffeapp/shared';
import { useOrder, useUpdateOrderStatus, useToggleItemPrepared } from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';

/** Tick interval for timer display (1s). */
const TIMER_TICK_MS = 1_000;

/**
 * Returns elapsed seconds since `startedAt`, updating every second.
 * Pass `null` to pause (no active timer).
 */
function useElapsedTimer(startedAt: string | null): number {
  const [elapsed, setElapsed] = useState(() =>
    startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000) : 0,
  );

  useEffect(() => {
    if (!startedAt) {
      setElapsed(0);
      return;
    }

    const update = () =>
      setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
    update();
    const id = setInterval(update, TIMER_TICK_MS);
    return () => clearInterval(id);
  }, [startedAt]);

  return elapsed;
}

/** Format seconds as M:SS or H:MM:SS. */
function formatTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function BaristaOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? null);
  const updateStatus = useUpdateOrderStatus();
  const toggleItem = useToggleItemPrepared();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.BARISTA] });

  // US-C03: Timer when status = MAKING — use updatedAt as "started pha" timestamp
  const timerStartedAt = order?.status === OrderStatus.MAKING ? order.updatedAt : null;
  const elapsed = useElapsedTimer(timerStartedAt);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được đơn" onRetry={() => refetch()} />
      </View>
    );
  }

  const handleStatus = (status: OrderStatus) => {
    runWithActor((actedByStaffId) => {
      updateStatus.mutate(
        { orderId: order.id, status, actedByStaffId },
        {
          onSuccess: () => {
            if (status === OrderStatus.READY) {
              showMessage('Hoàn thành', `Đơn #${order.orderNumber} sẵn sàng giao`, 'success');
              router.back();
              return;
            }
            showMessage('Đã cập nhật', ORDER_STATUS_LABELS[status], 'success');
          },
          onError: (err: unknown) => {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'Không cập nhật được';
            showMessage('Lỗi', msg, 'error');
          },
        },
      );
    });
  };

  const handleToggleItem = (itemId: string, isPrepared: boolean) => {
    toggleItem.mutate(
      { orderId: order.id, itemId, isPrepared: !isPrepared },
      {
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Không cập nhật được';
          showMessage('Lỗi', msg, 'error');
        },
      },
    );
  };

  const canToggleItems =
    order.status === OrderStatus.PENDING || order.status === OrderStatus.MAKING;
  const allPrepared = order.items.length > 0 && order.items.every((i) => i.isPrepared);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          {order.status === OrderStatus.MAKING ? (
            <View style={styles.timerBadge}>
              <Ionicons name="timer-outline" size={14} color={colors.white} />
              <Text style={styles.timerText}>{formatTimer(elapsed)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.meta}>
          {order.orderType === OrderType.DINE_IN ? 'Tại bàn' : 'Mang đi'} ·{' '}
          {ORDER_STATUS_LABELS[order.status]}
        </Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        {canToggleItems && order.items.length > 0 ? (
          <Text style={styles.preparedHint}>
            {allPrepared
              ? '✅ Tất cả món đã xong'
              : `${order.items.filter((i) => i.isPrepared).length}/${order.items.length} món đã xong`}
          </Text>
        ) : null}
      </Card>

      <Text style={styles.sectionTitle}>Món order</Text>
      {order.items.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, item.isPrepared && styles.itemPrepared]}>
                {item.quantity}x {item.productName}
              </Text>
              {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
            </View>
            {canToggleItems ? (
              <Pressable
                style={[styles.checkBtn, item.isPrepared && styles.checkBtnDone]}
                onPress={() => handleToggleItem(item.id, item.isPrepared)}
                disabled={toggleItem.isPending}
              >
                <Ionicons
                  name={item.isPrepared ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={item.isPrepared ? colors.primary : colors.textMuted}
                />
              </Pressable>
            ) : item.isPrepared ? (
              <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
            ) : null}
          </View>
        </Card>
      ))}

      <View style={styles.actions}>
        {order.status === OrderStatus.PENDING ? (
          <Button
            title="Bắt đầu pha"
            loading={updateStatus.isPending}
            onPress={() => handleStatus(OrderStatus.MAKING)}
          />
        ) : null}
        {order.status === OrderStatus.MAKING ? (
          <Button
            title="Hoàn thành đơn"
            loading={updateStatus.isPending}
            onPress={() => handleStatus(OrderStatus.READY)}
          />
        ) : null}
      </View>
      {pickerModal}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: { fontSize: 20, fontWeight: '700', color: colors.text },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  meta: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  total: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  preparedHint: { fontSize: 13, color: colors.primary, marginTop: spacing.xs, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginVertical: spacing.md },
  itemCard: { marginBottom: spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemPrepared: { textDecorationLine: 'line-through', opacity: 0.6 },
  itemNotes: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  checkBtn: { padding: 4 },
  checkBtnDone: { opacity: 0.8 },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
});
