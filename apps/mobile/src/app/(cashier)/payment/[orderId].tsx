import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
  colors,
  formatCurrency,
  spacing,
  borderRadius,
  StaffRole,
} from '@caffeapp/shared';
import { useCreatePayment, useOrder } from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen, Input } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';
import { opFrontTab } from '@shared/lib/navigation/operationalRoutes';

const METHODS = [
  PaymentMethod.CASH,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.CARD,
  PaymentMethod.E_WALLET,
] as const;

export default function CashierPaymentScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isError, refetch } = useOrder(orderId ?? null);
  const createPayment = useCreatePayment();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.CASHIER] });
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashReceived, setCashReceived] = useState('');

  const changeAmount = useMemo(() => {
    if (!order || method !== PaymentMethod.CASH) return 0;
    const received = Number(cashReceived.replace(/\D/g, '')) || 0;
    return Math.max(0, received - order.total);
  }, [cashReceived, method, order]);

  const canSubmit = useMemo(() => {
    if (!order) return false;
    if (method === PaymentMethod.CASH) {
      const received = Number(cashReceived.replace(/\D/g, '')) || 0;
      return received >= order.total;
    }
    return true;
  }, [cashReceived, method, order]);

  if (isError || !order) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được đơn" onRetry={() => refetch()} />
      </View>
    );
  }

  const pretaxAmount = order.subtotal - order.taxAmount;

  const handlePay = () => {
    const amount =
      method === PaymentMethod.CASH
        ? Number(cashReceived.replace(/\D/g, '')) || 0
        : order.total;

    runWithActor((actedByStaffId) => {
      createPayment.mutate(
        {
          orderId: order.id,
          method,
          amount,
          actedByStaffId,
          ...(method === PaymentMethod.CASH ? { changeAmount } : {}),
        },
        {
          onSuccess: () => {
            showMessage('Thành công', `Đã thanh toán đơn #${order.orderNumber}`, 'success');
            router.replace(opFrontTab('orders'));
          },
          onError: (err: unknown) => {
            const msg =
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'Thanh toán thất bại';
            showMessage('Lỗi', msg, 'error');
          },
        },
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.label}>Tổng thanh toán</Text>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Tiền hàng (chưa thuế)</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(pretaxAmount)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>VAT 8%</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(order.taxAmount)}</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Phương thức</Text>
      <View style={styles.methodGrid}>
        {METHODS.map((m) => (
          <Button
            key={m}
            title={PAYMENT_METHOD_LABELS[m]}
            variant={method === m ? 'primary' : 'outline'}
            onPress={() => setMethod(m)}
            style={styles.methodBtn}
          />
        ))}
      </View>

      {method === PaymentMethod.CASH ? (
        <View style={styles.cashBlock}>
          <Input
            label="Tiền khách đưa"
            keyboardType="numeric"
            value={cashReceived}
            onChangeText={setCashReceived}
            placeholder="0"
          />
          <Text style={styles.changeLabel}>
            Tiền thừa: <Text style={styles.changeValue}>{formatCurrency(changeAmount)}</Text>
          </Text>
        </View>
      ) : (
        <Card style={styles.hintCard}>
          <Text style={styles.hint}>
            {method === PaymentMethod.BANK_TRANSFER
              ? 'Hiển thị QR/STK cho khách chuyển khoản, sau đó xác nhận.'
              : 'Xác nhận khách đã thanh toán qua máy POS/ví.'}
          </Text>
        </Card>
      )}

      <Button
        title="Hoàn tất thanh toán"
        disabled={!canSubmit}
        loading={createPayment.isPending}
        onPress={handlePay}
        style={{ marginTop: spacing.lg }}
      />
      {pickerModal}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  label: { fontSize: 14, color: colors.textSecondary },
  total: { fontSize: 28, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
  breakdown: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  breakdownLabel: { fontSize: 14, color: colors.textSecondary },
  breakdownValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  methodGrid: { gap: spacing.sm },
  methodBtn: {},
  cashBlock: { marginTop: spacing.md },
  changeLabel: { fontSize: 15, color: colors.text, marginTop: spacing.md },
  changeValue: { fontWeight: '700', color: colors.primary },
  hintCard: { marginTop: spacing.md },
  hint: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
});
