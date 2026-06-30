import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  type BranchBankInfoDto,
  PaymentMethod,
  PAYMENT_METHOD_LABELS,
  colors,
  formatCurrency,
  spacing,
  StaffRole,
} from '@caffeapp/shared';
import { useBranches } from '@features/auth';
import { useCreatePayment, useOrder } from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen, Input } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';
import { opFrontTab } from '@shared/lib/navigation/operationalRoutes';

const METHODS = [PaymentMethod.CASH, PaymentMethod.BANK_TRANSFER] as const;

function buildVietQrUrl(bankInfo: BranchBankInfoDto, amount: number, orderNumber: string): string {
  const bankCode = encodeURIComponent(bankInfo.bankCode ?? '');
  const account = encodeURIComponent(bankInfo.account);
  const addInfo = encodeURIComponent(`CAFFE ${orderNumber}`);
  const accountName = bankInfo.holder ? `&accountName=${encodeURIComponent(bankInfo.holder)}` : '';

  return `https://img.vietqr.io/image/${bankCode}-${account}-compact2.png?amount=${amount}&addInfo=${addInfo}${accountName}`;
}

export default function CashierPaymentScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { data: order, isError, refetch } = useOrder(orderId ?? null);
  const { data: branches } = useBranches();
  const createPayment = useCreatePayment();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.CASHIER] });
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashReceived, setCashReceived] = useState('');

  const branchBankInfo = useMemo(() => {
    const branch = branches?.find((item) => item.id === order?.branchId);
    return branch?.bankInfo ?? null;
  }, [branches, order?.branchId]);

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

  const transferQrUrl = useMemo(() => {
    if (!order || method !== PaymentMethod.BANK_TRANSFER || !branchBankInfo?.bankCode) {
      return null;
    }

    return buildVietQrUrl(branchBankInfo, order.total, order.orderNumber);
  }, [branchBankInfo, method, order]);

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
      method === PaymentMethod.CASH ? Number(cashReceived.replace(/\D/g, '')) || 0 : order.total;

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
          {transferQrUrl ? (
            <Image source={{ uri: transferQrUrl }} style={styles.qrImage} resizeMode="contain" />
          ) : null}
          {branchBankInfo ? (
            <View style={styles.bankInfo}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Ngân hàng</Text>
                <Text style={styles.bankValue}>{branchBankInfo.bank}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>STK</Text>
                <Text selectable style={styles.bankValue}>
                  {branchBankInfo.account}
                </Text>
              </View>
              {branchBankInfo.holder ? (
                <View style={styles.bankRow}>
                  <Text style={styles.bankLabel}>Chủ TK</Text>
                  <Text style={styles.bankValue}>{branchBankInfo.holder}</Text>
                </View>
              ) : null}
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Số tiền</Text>
                <Text style={styles.bankValue}>{formatCurrency(order.total)}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.hint}>Chưa có STK chuyển khoản cho chi nhánh này.</Text>
          )}
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
  breakdown: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  breakdownLabel: { fontSize: 14, color: colors.textSecondary },
  breakdownValue: { fontSize: 14, color: colors.text, fontWeight: '500' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  methodGrid: { gap: spacing.sm },
  methodBtn: {},
  cashBlock: { marginTop: spacing.md },
  changeLabel: { fontSize: 15, color: colors.text, marginTop: spacing.md },
  changeValue: { fontWeight: '700', color: colors.primary },
  hintCard: { marginTop: spacing.md },
  hint: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  qrImage: {
    alignSelf: 'center',
    width: 220,
    height: 220,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  bankInfo: { gap: spacing.sm },
  bankRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  bankLabel: { fontSize: 14, color: colors.textSecondary },
  bankValue: { flex: 1, textAlign: 'right', fontSize: 14, color: colors.text, fontWeight: '600' },
});
