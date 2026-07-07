import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  OrderType,
  TableStatus,
  colors,
  formatCurrency,
  isAwaitingDelivery,
  isAwaitingPayment,
  spacing,
  StaffRole,
} from '@caffeapp/shared';
import type { OrderDto, TableDto } from '@caffeapp/shared';
import {
  useDeliverOrder,
  useMergeOrders,
  useOrder,
  useOrders,
  useSplitOrder,
  useTables,
  useTransferOrderTable,
} from '@features/orders';
import { useStaffActor } from '@features/staff';
import { Button, Card, ErrorScreen, Input } from '@shared/components/ui';
import { confirmAction, showMessage } from '@shared/lib/ui/confirm';
import { getErrorMessage, paymentService } from '@shared/lib/api';
import { usePermission } from '@shared/hooks/usePermission';
import { opStack } from '@shared/lib/navigation/operationalRoutes';
import { useSessionStore } from '@shared/stores/session';

type ActionMode = 'transfer' | 'merge' | 'split' | null;

const ACTIVE_STATUS_FILTER = 'PENDING,MAKING,READY';

function isActiveBill(order: OrderDto): boolean {
  return (
    order.status === OrderStatus.PENDING ||
    order.status === OrderStatus.MAKING ||
    order.status === OrderStatus.READY
  );
}

export default function CashierOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const { data: order, isLoading, isError, refetch } = useOrder(id ?? null);
  const { data: tables } = useTables(activeBranchId);
  const { data: activeOrders } = useOrders({
    branchId: activeBranchId,
    status: ACTIVE_STATUS_FILTER,
    refetchInterval: false,
  });
  const deliverOrder = useDeliverOrder();
  const transferOrder = useTransferOrderTable();
  const mergeOrders = useMergeOrders();
  const splitOrder = useSplitOrder();
  const { runWithActor, pickerModal } = useStaffActor({ operatorRoles: [StaffRole.CASHIER] });
  const [mode, setMode] = useState<ActionMode>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [mergeSourceIds, setMergeSourceIds] = useState<string[]>([]);
  const [splitQuantities, setSplitQuantities] = useState<Record<string, number>>({});
  const [voidReason, setVoidReason] = useState('');

  const queryClient = useQueryClient();
  const canVoidPayment = usePermission('payments:void') && order?.status === OrderStatus.PAID;
  const { data: orderPayments } = useQuery({
    queryKey: ['payments', order?.id],
    queryFn: () => paymentService.getByOrder(order!.id),
    enabled: canVoidPayment && Boolean(order?.id),
  });
  const voidPayment = useMutation({
    mutationFn: (params: { paymentId: string; reason: string }) =>
      paymentService.voidPayment(params),
    onSuccess: () => {
      setVoidReason('');
      void queryClient.invalidateQueries({ queryKey: ['order'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
      void queryClient.invalidateQueries({ queryKey: ['payments'] });
      showMessage('Đã hủy thanh toán', 'Đơn quay lại trạng thái chờ thanh toán', 'success');
    },
    onError: (err: unknown) => {
      showMessage('Lỗi', getErrorMessage(err, 'Không hủy được thanh toán'), 'error');
    },
  });

  const handleVoidPayment = async (paymentId: string) => {
    if (voidReason.trim().length < 5) {
      showMessage('Thiếu lý do', 'Nhập lý do hủy thanh toán (ít nhất 5 ký tự)', 'error');
      return;
    }
    const ok = await confirmAction(
      'Hủy thanh toán',
      'Đơn sẽ quay lại trạng thái chờ thanh toán. Thao tác được ghi vào nhật ký.',
    );
    if (!ok) return;
    voidPayment.mutate({ paymentId, reason: voidReason.trim() });
  };

  const otherActiveOrders = useMemo(
    () =>
      (activeOrders ?? []).filter((entry) => order && entry.id !== order.id && isActiveBill(entry)),
    [activeOrders, order],
  );

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
  const canRebill = isActiveBill(order);
  const selectedTable = tables?.find((table) => table.id === selectedTableId) ?? null;
  const totalItemQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const splitItemQuantity = Object.values(splitQuantities).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  const handleDeliver = () => {
    runWithActor((actedByStaffId) => {
      deliverOrder.mutate(
        { orderId: order.id, actedByStaffId },
        {
          onSuccess: () => {
            showMessage('Đã giao món', 'Có thể thu tiền khi khách sẵn sàng', 'success');
          },
          onError: (err: unknown) => {
            showMessage('Lỗi', getErrorMessage(err, 'Không cập nhật được trạng thái'), 'error');
          },
        },
      );
    });
  };

  const handleTransfer = () => {
    if (!selectedTable) return;
    runWithActor((actedByStaffId) => {
      transferOrder.mutate(
        {
          orderId: order.id,
          tableId: selectedTable.id,
          mergeIntoOccupied: selectedTable.status === TableStatus.OCCUPIED,
          actedByStaffId,
        },
        {
          onSuccess: (updated) => {
            setSelectedTableId(null);
            setMode(null);
            showMessage(
              selectedTable.status === TableStatus.OCCUPIED ? 'Đã gộp bill' : 'Đã chuyển bàn',
              `Đơn #${updated.orderNumber} đã được cập nhật`,
              'success',
            );
            if (updated.id !== order.id) {
              router.replace(opStack(`/order/${updated.id}`));
            }
          },
          onError: (err: unknown) => {
            showMessage('Lỗi', getErrorMessage(err, 'Không chuyển được bàn'), 'error');
          },
        },
      );
    });
  };

  const handleMerge = () => {
    if (mergeSourceIds.length === 0) return;
    runWithActor((actedByStaffId) => {
      mergeOrders.mutate(
        { targetOrderId: order.id, sourceOrderIds: mergeSourceIds, actedByStaffId },
        {
          onSuccess: () => {
            setMergeSourceIds([]);
            setMode(null);
            showMessage('Đã gộp bill', 'Các món đã được chuyển vào bill hiện tại', 'success');
          },
          onError: (err: unknown) => {
            showMessage('Lỗi', getErrorMessage(err, 'Không gộp được bill'), 'error');
          },
        },
      );
    });
  };

  const handleSplit = () => {
    const items = Object.entries(splitQuantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ itemId, quantity }));
    if (items.length === 0 || splitItemQuantity >= totalItemQuantity) return;

    runWithActor((actedByStaffId) => {
      splitOrder.mutate(
        { orderId: order.id, items, actedByStaffId },
        {
          onSuccess: (result) => {
            setSplitQuantities({});
            setMode(null);
            showMessage(
              'Đã tách bill',
              `Bill mới #${result.splitOrder.orderNumber} đã được tạo`,
              'success',
            );
          },
          onError: (err: unknown) => {
            showMessage('Lỗi', getErrorMessage(err, 'Không tách được bill'), 'error');
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

      {canRebill ? (
        <Card style={styles.opsCard}>
          <Text style={styles.sectionTitle}>Bill & bàn</Text>
          <View style={styles.actionRow}>
            <ActionChip
              label="Chuyển bàn"
              active={mode === 'transfer'}
              onPress={() => setMode(mode === 'transfer' ? null : 'transfer')}
            />
            <ActionChip
              label="Gộp bill"
              active={mode === 'merge'}
              onPress={() => setMode(mode === 'merge' ? null : 'merge')}
            />
            <ActionChip
              label="Tách bill"
              active={mode === 'split'}
              onPress={() => setMode(mode === 'split' ? null : 'split')}
            />
          </View>

          {mode === 'transfer' ? (
            <View style={styles.panel}>
              <View style={styles.choiceGrid}>
                {(tables ?? []).map((table) => (
                  <TableChoice
                    key={table.id}
                    table={table}
                    selected={selectedTableId === table.id}
                    current={order.tableId === table.id}
                    onPress={() => setSelectedTableId(table.id)}
                  />
                ))}
              </View>
              <Button
                title={
                  selectedTable?.status === TableStatus.OCCUPIED
                    ? 'Chuyển & gộp bill'
                    : 'Chuyển bàn'
                }
                disabled={!selectedTable || selectedTable.status === TableStatus.MAINTENANCE}
                loading={transferOrder.isPending}
                onPress={handleTransfer}
              />
            </View>
          ) : null}

          {mode === 'merge' ? (
            <View style={styles.panel}>
              {otherActiveOrders.length === 0 ? (
                <Text style={styles.mutedText}>Không có bill khác đang mở.</Text>
              ) : (
                otherActiveOrders.map((entry) => (
                  <MergeChoice
                    key={entry.id}
                    order={entry}
                    selected={mergeSourceIds.includes(entry.id)}
                    onPress={() =>
                      setMergeSourceIds((prev) =>
                        prev.includes(entry.id)
                          ? prev.filter((sourceId) => sourceId !== entry.id)
                          : [...prev, entry.id],
                      )
                    }
                  />
                ))
              )}
              <Button
                title="Gộp vào bill này"
                disabled={mergeSourceIds.length === 0}
                loading={mergeOrders.isPending}
                onPress={handleMerge}
              />
            </View>
          ) : null}

          {mode === 'split' ? (
            <View style={styles.panel}>
              {order.items.map((item) => (
                <SplitRow
                  key={item.id}
                  item={item}
                  value={splitQuantities[item.id] ?? 0}
                  onChange={(quantity) =>
                    setSplitQuantities((prev) => ({ ...prev, [item.id]: quantity }))
                  }
                />
              ))}
              <Button
                title="Tạo bill mới"
                disabled={splitItemQuantity === 0 || splitItemQuantity >= totalItemQuantity}
                loading={splitOrder.isPending}
                onPress={handleSplit}
              />
            </View>
          ) : null}
        </Card>
      ) : null}

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
        <Text style={styles.hint}>
          Pha xong · giao món cho khách hoặc thu tiền trước nếu khách yêu cầu
        </Text>
      ) : null}

      {canVoidPayment && orderPayments && orderPayments.length > 0 ? (
        <Card style={styles.opsCard}>
          <Text style={styles.sectionTitle}>Hủy thanh toán (Quản lý)</Text>
          <Text style={styles.mutedText}>
            {`Đã thu ${formatCurrency(orderPayments[0].amount)} · ${
              orderPayments[0].method === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'
            }`}
          </Text>
          <Input
            label="Lý do hủy (bắt buộc)"
            value={voidReason}
            onChangeText={setVoidReason}
            placeholder="VD: thu nhầm bàn B05"
          />
          <Button
            title="Hủy thanh toán"
            variant="destructive"
            loading={voidPayment.isPending}
            disabled={voidReason.trim().length < 5}
            onPress={() => void handleVoidPayment(orderPayments[0].id)}
          />
        </Card>
      ) : null}
      {pickerModal}
    </ScrollView>
  );
}

function ActionChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.actionChip, active && styles.actionChipActive]} onPress={onPress}>
      <Text style={[styles.actionChipText, active && styles.actionChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function TableChoice({
  table,
  selected,
  current,
  onPress,
}: {
  table: TableDto;
  selected: boolean;
  current: boolean;
  onPress: () => void;
}) {
  const disabled = table.status === TableStatus.MAINTENANCE || current;
  return (
    <Pressable
      disabled={disabled}
      style={[
        styles.tableChoice,
        selected && styles.choiceSelected,
        disabled && styles.choiceDisabled,
      ]}
      onPress={onPress}
    >
      <Text style={styles.choiceTitle}>{table.code}</Text>
      <Text style={styles.choiceMeta}>
        {current ? 'Hiện tại' : table.status === TableStatus.OCCUPIED ? 'Gộp bill' : table.status}
      </Text>
    </Pressable>
  );
}

function MergeChoice({
  order,
  selected,
  onPress,
}: {
  order: OrderDto;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.mergeChoice, selected && styles.choiceSelected]} onPress={onPress}>
      <View>
        <Text style={styles.choiceTitle}>#{order.orderNumber}</Text>
        <Text style={styles.choiceMeta}>{ORDER_STATUS_LABELS[order.status]}</Text>
      </View>
      <Text style={styles.choiceAmount}>{formatCurrency(order.total)}</Text>
    </Pressable>
  );
}

function SplitRow({
  item,
  value,
  onChange,
}: {
  item: OrderDto['items'][number];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.splitRow}>
      <View style={styles.splitInfo}>
        <Text style={styles.choiceTitle}>{item.productName}</Text>
        <Text style={styles.choiceMeta}>
          {item.quantity} món · {formatCurrency(item.lineTotal)}
        </Text>
      </View>
      <View style={styles.stepper}>
        <Pressable style={styles.stepButton} onPress={() => onChange(Math.max(0, value - 1))}>
          <Text style={styles.stepText}>-</Text>
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable
          style={styles.stepButton}
          onPress={() => onChange(Math.min(item.quantity, value + 1))}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
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
  opsCard: { marginTop: spacing.base, gap: spacing.base },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  actionChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  actionChipText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  actionChipTextActive: { color: colors.primary },
  panel: { gap: spacing.sm },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tableChoice: {
    width: '31%',
    minWidth: 92,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  mergeChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  choiceSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  choiceDisabled: { opacity: 0.45 },
  choiceTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  choiceMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  choiceAmount: { fontSize: 14, fontWeight: '700', color: colors.primary },
  mutedText: { color: colors.textMuted, fontSize: 13 },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.surface,
  },
  splitInfo: { flex: 1 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  stepText: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  stepValue: { minWidth: 22, textAlign: 'center', color: colors.text, fontWeight: '700' },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.base,
  },
});
