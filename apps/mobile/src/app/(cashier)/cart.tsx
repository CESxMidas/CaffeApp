import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, formatCurrency, calculateOrderTotal } from '@caffeapp/shared';
import { useCreateOrder } from '@features/orders';
import { Button, Card } from '@shared/components/ui';
import { showMessage } from '@shared/lib/ui/confirm';
import { useCartStore } from '@shared/stores/cart';

export default function CartScreen() {
  const branchId = useCartStore((s) => s.branchId);
  const orderType = useCartStore((s) => s.orderType);
  const tableId = useCartStore((s) => s.tableId);
  const tableCode = useCartStore((s) => s.tableCode);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const createOrder = useCreateOrder();

  const { tax_amount, total } = calculateOrderTotal(subtotal);

  const handleSubmit = () => {
    if (!branchId || !orderType || items.length === 0) {
      showMessage('Giỏ trống', 'Chưa có món trong giỏ hàng', 'warning');
      return;
    }

    createOrder.mutate(
      {
        branchId,
        orderType,
        tableId: tableId ?? undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          notes: i.notes ?? undefined,
        })),
      },
      {
        onSuccess: (order) => {
          clearCart();
          showMessage('Đã gửi bếp', `Đơn ${order.orderNumber} đang chờ pha`, 'success');
          router.replace('/(cashier)/(tabs)/home');
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Không gửi được đơn';
          showMessage('Lỗi', msg, 'error');
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {tableCode ? (
          <Text style={styles.meta}>Bàn {tableCode}</Text>
        ) : (
          <Text style={styles.meta}>Đơn mang đi</Text>
        )}

        {items.length === 0 ? (
          <Text style={styles.empty}>Chưa có món trong giỏ</Text>
        ) : (
          items.map((item) => (
            <Card key={item.id} style={styles.lineCard}>
              <View style={styles.lineRow}>
                <View style={styles.lineInfo}>
                  <Text style={styles.lineName}>{item.productName}</Text>
                  {item.notes ? <Text style={styles.lineNotes}>{item.notes}</Text> : null}
                  <Text style={styles.linePrice}>{formatCurrency(item.unitPrice)}</Text>
                </View>
                <View style={styles.qtyControls}>
                  <Pressable onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Ionicons name="remove-circle-outline" size={26} color={colors.primary} />
                  </Pressable>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <Pressable onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Ionicons name="add-circle-outline" size={26} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.lineTotal}>
                {formatCurrency(item.unitPrice * item.quantity)}
              </Text>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tạm tính</Text>
          <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT 8%</Text>
          <Text style={styles.summaryValue}>{formatCurrency(tax_amount)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <Button
          title="Gửi vào bếp"
          loading={createOrder.isPending}
          disabled={items.length === 0}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  meta: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.md },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
  lineCard: { marginBottom: spacing.sm },
  lineRow: { flexDirection: 'row', gap: spacing.md },
  lineInfo: { flex: 1 },
  lineName: { fontSize: 16, fontWeight: '600', color: colors.text },
  lineNotes: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  linePrice: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qty: { fontSize: 16, fontWeight: '600', minWidth: 24, textAlign: 'center' },
  lineTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  summary: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, color: colors.text },
  totalRow: { marginTop: spacing.sm, marginBottom: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '700', color: colors.primary },
});
