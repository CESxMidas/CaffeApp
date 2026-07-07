import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { colors, formatCurrency, spacing, borderRadius } from '@caffeapp/shared';
import type { ShiftDto } from '@caffeapp/shared';
import { Button, Card, ErrorScreen } from '@shared/components/ui';
import { confirmAction, showMessage } from '@shared/lib/ui/confirm';
import { getErrorMessage, paymentService, shiftService } from '@shared/lib/api';
import { useActiveShift, useCloseShift, useOpenShift, useShifts } from '@features/manager';
import { useSessionStore } from '@shared/stores/session';

const SHIFT_TYPES = [
  { value: 'MORNING', label: 'Ca sáng' },
  { value: 'AFTERNOON', label: 'Ca chiều' },
  { value: 'EVENING', label: 'Ca tối' },
  { value: 'FULL', label: 'Ca cả ngày' },
];

function formatTime(iso: string | null): string {
  if (!iso) return '--';
  return new Date(iso).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function ShiftsScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const { data: shifts, isLoading, isError, refetch } = useShifts(activeBranchId);
  const { data: activeShift } = useActiveShift(activeBranchId);
  const openShift = useOpenShift();
  const closeShift = useCloseShift();
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [shiftName, setShiftName] = useState('');
  const [shiftType, setShiftType] = useState('MORNING');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('15:00');

  const queryClient = useQueryClient();
  const { data: reconciliation } = useQuery({
    queryKey: ['shift-reconciliation', activeShift?.id],
    queryFn: () => shiftService.getReconciliation(activeShift!.id),
    enabled: Boolean(activeShift?.id),
    refetchInterval: 60_000,
  });
  const verifyTransfer = useMutation({
    mutationFn: (paymentId: string) => paymentService.verifyPayment(paymentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shift-reconciliation'] });
      showMessage('Đã xác nhận', 'Giao dịch chuyển khoản đã được xác nhận', 'success');
    },
    onError: (err: unknown) => {
      showMessage('Lỗi', getErrorMessage(err, 'Không xác nhận được giao dịch'), 'error');
    },
  });

  const handleOpen = () => {
    if (!activeBranchId || !shiftName.trim()) return;
    openShift.mutate(
      {
        branchId: activeBranchId,
        name: shiftName.trim(),
        shiftType,
        startTime,
        endTime,
      },
      {
        onSuccess: () => {
          showMessage('Thành công', 'Đã mở ca làm việc', 'success');
          setShowOpenModal(false);
          setShiftName('');
        },
        onError: (err: unknown) => {
          showMessage('Lỗi', getErrorMessage(err, 'Không mở được ca'), 'error');
        },
      },
    );
  };

  const handleClose = async () => {
    if (!activeShift) return;
    const unverifiedCount = reconciliation?.unverifiedTransfers.length ?? 0;
    if (unverifiedCount > 0) {
      const proceed = await confirmAction(
        'Còn chuyển khoản chưa xác nhận',
        `${unverifiedCount} giao dịch chuyển khoản chưa được xác nhận đã vào tài khoản. Vẫn đóng ca?`,
      );
      if (!proceed) return;
    }
    closeShift.mutate(activeShift.id, {
      onSuccess: () => {
        showMessage('Thành công', 'Đã đóng ca làm việc', 'success');
      },
      onError: (err: unknown) => {
        showMessage('Lỗi', getErrorMessage(err, 'Không đóng được ca'), 'error');
      },
    });
  };

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
        <ErrorScreen message="Không tải được ca làm việc" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ca làm việc</Text>

      {activeShift ? (
        <Card style={styles.activeCard}>
          <View style={styles.activeHeader}>
            <Ionicons name="time" size={24} color={colors.white} />
            <Text style={styles.activeTitle}>{activeShift.name}</Text>
          </View>
          <Text style={styles.activeMeta}>
            {SHIFT_TYPES.find((t) => t.value === activeShift.shiftType)?.label ??
              activeShift.shiftType}
            {' · '}
            {activeShift.startTime} - {activeShift.endTime}
          </Text>
          <Text style={styles.activeTime}>Mở: {formatTime(activeShift.openedAt)}</Text>
          <View style={styles.closeBtnWrap}>
            <Button
              title="Đóng ca"
              loading={closeShift.isPending}
              onPress={() => void handleClose()}
              variant="outline"
            />
          </View>
        </Card>
      ) : (
        <Card style={styles.noActiveCard}>
          <Ionicons name="time-outline" size={32} color={colors.textMuted} />
          <Text style={styles.noActiveText}>Chưa có ca nào đang mở</Text>
          <View style={styles.openBtnWrap}>
            <Button title="Mở ca mới" onPress={() => setShowOpenModal(true)} />
          </View>
        </Card>
      )}

      {activeShift && reconciliation ? (
        <Card>
          <Text style={styles.reconTitle}>Đối soát ca</Text>
          <View style={styles.reconRow}>
            <Text style={styles.reconLabel}>Tiền mặt trong két (dự kiến)</Text>
            <Text style={styles.reconValue}>{formatCurrency(reconciliation.expectedCash)}</Text>
          </View>
          <View style={styles.reconRow}>
            <Text style={styles.reconLabel}>{`Đơn tiền mặt: ${reconciliation.cashOrders}`}</Text>
            <Text style={styles.reconLabel}>{`Đơn CK: ${reconciliation.transferOrders}`}</Text>
          </View>
          <View style={styles.reconRow}>
            <Text style={styles.reconLabel}>Tổng chuyển khoản</Text>
            <Text style={styles.reconValue}>{formatCurrency(reconciliation.transferTotal)}</Text>
          </View>

          {reconciliation.unverifiedTransfers.length > 0 ? (
            <View style={styles.reconUnverified}>
              <Text style={styles.reconWarn}>
                {`${reconciliation.unverifiedTransfers.length} chuyển khoản chưa xác nhận:`}
              </Text>
              {reconciliation.unverifiedTransfers.map((t) => (
                <View key={t.paymentId} style={styles.reconRow}>
                  <Text style={styles.reconLabel}>
                    {`#${t.orderNumber} · ${formatCurrency(t.amount)} · ${formatTime(t.paidAt)}`}
                  </Text>
                  <Button
                    title="Đã nhận"
                    fullWidth={false}
                    variant="outline"
                    loading={verifyTransfer.isPending}
                    onPress={() => verifyTransfer.mutate(t.paymentId)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.reconOk}>Tất cả chuyển khoản đã được xác nhận ✓</Text>
          )}
        </Card>
      ) : null}

      <Text style={styles.sectionTitle}>Lịch sử ca</Text>
      {shifts && shifts.length > 0 ? (
        shifts.map((shift) => <ShiftHistoryCard key={shift.id} shift={shift} />)
      ) : (
        <Text style={styles.emptyText}>Chưa có ca nào</Text>
      )}

      <Modal visible={showOpenModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mở ca làm việc</Text>

            <Text style={styles.inputLabel}>Tên ca</Text>
            <TextInput
              style={styles.input}
              value={shiftName}
              onChangeText={setShiftName}
              placeholder="VD: Ca sáng 01/07"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.inputLabel}>Loại ca</Text>
            <View style={styles.typeRow}>
              {SHIFT_TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  style={[styles.typeBtn, shiftType === t.value && styles.typeBtnActive]}
                  onPress={() => setShiftType(t.value)}
                >
                  <Text
                    style={[styles.typeBtnText, shiftType === t.value && styles.typeBtnTextActive]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeInputWrap}>
                <Text style={styles.inputLabel}>Giờ bắt đầu</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="07:00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={styles.timeInputWrap}>
                <Text style={styles.inputLabel}>Giờ kết thúc</Text>
                <TextInput
                  style={styles.input}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="15:00"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button title="Hủy" onPress={() => setShowOpenModal(false)} variant="outline" />
              <View style={styles.modalActionGap} />
              <Button
                title="Mở ca"
                loading={openShift.isPending}
                onPress={handleOpen}
                disabled={!shiftName.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function ShiftHistoryCard({ shift }: { shift: ShiftDto }) {
  const isOpen = shift.status === 'OPEN';
  return (
    <Card style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.historyInfo}>
          <Text style={styles.historyName}>{shift.name}</Text>
          <Text style={styles.historyDate}>{formatDate(shift.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusClosed]}>
          <Text
            style={[styles.statusText, isOpen ? styles.statusTextOpen : styles.statusTextClosed]}
          >
            {isOpen ? 'Đang mở' : 'Đã đóng'}
          </Text>
        </View>
      </View>
      <View style={styles.historyStats}>
        <Text style={styles.historyMeta}>
          {formatTime(shift.openedAt)} - {formatTime(shift.closedAt)}
        </Text>
        {!isOpen ? (
          <Text style={styles.historyRevenue}>
            {formatCurrency(shift.totalRevenue)} · {shift.totalOrders} đơn
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  activeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  activeTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  activeMeta: { fontSize: 14, color: colors.white, opacity: 0.9, marginTop: spacing.xs },
  activeTime: { fontSize: 13, color: colors.white, opacity: 0.8, marginTop: 4 },
  closeBtnWrap: { marginTop: spacing.md },
  noActiveCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  noActiveText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  openBtnWrap: { alignSelf: 'stretch' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', padding: spacing.md },
  historyCard: { marginBottom: spacing.sm },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyInfo: { flex: 1 },
  historyName: { fontSize: 15, fontWeight: '600', color: colors.text },
  historyDate: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusOpen: { backgroundColor: colors.primaryLight },
  statusClosed: { backgroundColor: colors.surfaceMuted },
  reconTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  reconLabel: { fontSize: 13, color: colors.textSecondary, flexShrink: 1 },
  reconValue: { fontSize: 15, fontWeight: '700', color: colors.text },
  reconUnverified: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reconWarn: { fontSize: 13, fontWeight: '600', color: colors.warning },
  reconOk: { fontSize: 13, color: colors.primary, marginTop: spacing.md },
  statusText: { fontSize: 12, fontWeight: '600' },
  statusTextOpen: { color: colors.primary },
  statusTextClosed: { color: colors.textMuted },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  historyMeta: { fontSize: 13, color: colors.textSecondary },
  historyRevenue: { fontSize: 13, fontWeight: '600', color: colors.primary },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  inputLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  typeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  typeBtnText: { fontSize: 13, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.primary, fontWeight: '600' },
  timeRow: { flexDirection: 'row', gap: spacing.sm },
  timeInputWrap: { flex: 1 },
  modalActions: { flexDirection: 'row', marginTop: spacing.md },
  modalActionGap: { width: spacing.sm },
});
