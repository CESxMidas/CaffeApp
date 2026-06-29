import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  OrderType,
  colors,
  formatCurrency,
  isAwaitingDelivery,
  isAwaitingPayment,
  spacing,
  StaffRole,
} from '@caffeapp/shared';
import { useDeliverOrder, useOrder } from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';
import { opStack } from '@shared/lib/navigation/operationalRoutes';

export default function CashierOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? null);
  const deliverOrder = useDeliverOrder();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.CASHIER] });

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

  const canMarkDelivered = isAwaitingDelivery(order);
  const canPay = order.status === OrderStatus.READY;

  const handleDeliver = () => {
    runWithActor((actedByStaffId) => {
      deliverOrder.mutate(
        { orderId: order.id, actedByStaffId },
        {
          onSuccess: () => {
            showMessage('Đã giao món', 'Có thể thu tiền khi khách sẵn sàng', 'success');
          },
          onError: (err: unknown) => {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'Không cập nhật được trạng thái';
            showMessage('Lỗi', msg, 'error');
          },
        },
      );
    });
  };

  const statusLabel = isAwaitingPayment(order)
    ? 'Chờ thanh toán'
    : ORDER_STATUS_LABELS[order.status];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
        <Text style={styles.meta}>
          {order.orderType === OrderType.DINE_IN ? 'Tại bàn' : 'Mang đi'} · {statusLabel}
        </Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </Card>

      {order.items.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <Text style={styles.itemName}>
            {item.quantity}x {item.productName}
          </Text>
          {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
          <Text style={styles.itemPrice}>{formatCurrency(item.lineTotal)}</Text>
        </Card>
      ))}

      {canMarkDelivered ? (
        <Button
          title="Đã giao"
          onPress={handleDeliver}
          loading={deliverOrder.isPending}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}

      {canPay ? (
        <Button
          title="Thanh toán"
          onPress={() => router.push(opStack(`/payment/${order.id}`))}
          style={{ marginTop: spacing.lg }}
        />
      ) : null}

      {canMarkDelivered ? (
        <Text style={styles.hint}>Pha xong — giao món cho khách (hoặc thu tiền trước nếu khách yêu cầu)</Text>
      ) : null}
      {pickerModal}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  orderNumber: { fontSize: 20, fontWeight: '700', color: colors.text },
  meta: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  total: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  itemCard: { marginTop: spacing.sm },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemNotes: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  itemPrice: { fontSize: 14, color: colors.primary, marginTop: 4, textAlign: 'right' },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.base,
  },
});
