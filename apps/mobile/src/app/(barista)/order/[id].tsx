import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  OrderType,
  colors,
  formatCurrency,
  spacing,
  StaffRole,
} from '@caffeapp/shared';
import { useOrder, useUpdateOrderStatus } from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';

export default function BaristaOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? null);
  const updateStatus = useUpdateOrderStatus();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.BARISTA] });

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
        <Text style={styles.meta}>
          {order.orderType === OrderType.DINE_IN ? 'Tại bàn' : 'Mang đi'} ·{' '}
          {ORDER_STATUS_LABELS[order.status]}
        </Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </Card>

      <Text style={styles.sectionTitle}>Món order</Text>
      {order.items.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <Text style={styles.itemName}>
            {item.quantity}x {item.productName}
          </Text>
          {item.notes ? <Text style={styles.itemNotes}>{item.notes}</Text> : null}
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
  orderNumber: { fontSize: 20, fontWeight: '700', color: colors.text },
  meta: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  total: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginVertical: spacing.md },
  itemCard: { marginBottom: spacing.sm },
  itemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  itemNotes: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  actions: { marginTop: spacing.lg, gap: spacing.sm },
});
