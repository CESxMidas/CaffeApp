import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ROLE_LABELS, colors, spacing } from '@caffeapp/shared';
import type { StaffListItemDto } from '@caffeapp/shared';
import {
  useApproveBranchAssignment,
  usePendingBranchAssignments,
  useRejectBranchAssignment,
} from '@features/staff';
import { Button, Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { useIsOwner } from '@shared/hooks/usePermission';
import { confirmAction, showMessage } from '@shared/lib/ui/confirm';

function PendingCard({
  item,
  onApprove,
  onReject,
  loading,
}: {
  item: StaffListItemDto;
  onApprove: () => void;
  onReject: () => void;
  loading: boolean;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.meta}>
            {ROLE_LABELS[item.role]} · {item.email}
          </Text>
          <View style={styles.branchRow}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.branchName}>Đề xuất: {item.branchName ?? '—'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          title="Từ chối"
          variant="outline"
          fullWidth={false}
          style={styles.actionBtn}
          disabled={loading}
          onPress={onReject}
        />
        <Button
          title="Duyệt"
          fullWidth={false}
          style={styles.actionBtn}
          loading={loading}
          onPress={onApprove}
        />
      </View>
    </Card>
  );
}

/** Chủ quán duyệt / từ chối đề xuất gán chi nhánh từ quản lý. */
export default function BranchApprovalsScreen() {
  const isOwner = useIsOwner();
  const { data: pending, isLoading, isError, refetch } = usePendingBranchAssignments();
  const approve = useApproveBranchAssignment();
  const reject = useRejectBranchAssignment();

  useEffect(() => {
    if (!isOwner) {
      router.replace('/(manager)/dashboard');
    }
  }, [isOwner]);

  const confirmApprove = async (item: StaffListItemDto) => {
    const ok = await confirmAction(
      'Duyệt gán chi nhánh',
      `Cho phép ${item.fullName} làm việc tại ${item.branchName ?? 'chi nhánh'}?`,
    );
    if (!ok) return;

    approve.mutate(item.id, {
      onSuccess: () => showMessage('Đã duyệt', `${item.fullName} có thể đăng nhập.`),
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Không duyệt được';
        showMessage('Lỗi', msg);
      },
    });
  };

  const confirmReject = async (item: StaffListItemDto) => {
    const ok = await confirmAction(
      'Từ chối gán chi nhánh',
      `Từ chối đề xuất gán ${item.fullName} vào ${item.branchName ?? 'chi nhánh'}?`,
    );
    if (!ok) return;

    reject.mutate(item.id, {
      onSuccess: () => showMessage('Đã từ chối', 'Quản lý cần đề xuất lại.'),
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Không từ chối được';
        showMessage('Lỗi', msg);
      },
    });
  };

  if (!isOwner) return null;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !pending) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được danh sách chờ duyệt" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Chủ quán duyệt đề xuất từ quản lý. Nhân viên chỉ đăng nhập được sau khi bạn duyệt.
      </Text>

      {pending.length === 0 ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="Không có đề xuất chờ duyệt"
          subtitle="Khi quản lý gửi đề xuất gán chi nhánh, bạn sẽ thấy ở đây"
        />
      ) : (
        <View style={styles.list}>
          {pending.map((item) => (
            <PendingCard
              key={item.id}
              item={item}
              loading={approve.isPending || reject.isPending}
              onApprove={() => void confirmApprove(item)}
              onReject={() => void confirmReject(item)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  intro: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  list: { gap: spacing.sm },
  card: {},
  cardHeader: { flexDirection: 'row', gap: spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: colors.primary },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  branchRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm },
  branchName: { fontSize: 14, color: colors.text, fontWeight: '500' },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    justifyContent: 'flex-end',
  },
  actionBtn: { minWidth: 100 },
});
