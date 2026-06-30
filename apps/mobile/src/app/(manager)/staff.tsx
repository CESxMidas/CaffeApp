import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  BranchAssignmentStatus,
  BRANCH_ASSIGNMENT_STATUS_LABELS,
  ROLE_LABELS,
  colors,
  spacing,
  borderRadius,
} from '@caffeapp/shared';
import type { StaffListItemDto } from '@caffeapp/shared';
import { useBranches } from '@features/auth';
import { useProposeBranchAssignment, useStaffList } from '@features/staff';
import { Button, Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { usePermission, useIsOwner } from '@shared/hooks/usePermission';
import { confirmAction, showMessage } from '@shared/lib/ui/confirm';

function statusColor(status: BranchAssignmentStatus): string {
  switch (status) {
    case BranchAssignmentStatus.APPROVED:
      return colors.primaryDark;
    case BranchAssignmentStatus.PENDING_OWNER:
      return colors.warning;
    case BranchAssignmentStatus.REJECTED:
      return colors.error;
    default:
      return colors.textMuted;
  }
}

function StaffRow({
  item,
  selected,
  onSelect,
}: {
  item: StaffListItemDto;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable onPress={onSelect}>
      <Card style={[styles.staffCard, selected && styles.staffCardSelected]}>
        <View style={styles.staffRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.fullName.charAt(0)}</Text>
          </View>
          <View style={styles.staffInfo}>
            <Text style={styles.staffName}>{item.fullName}</Text>
            <Text style={styles.staffMeta}>
              {ROLE_LABELS[item.role]} · {item.email}
            </Text>
            {item.branchName ? (
              <Text style={styles.staffBranch}>CN: {item.branchName}</Text>
            ) : (
              <Text style={styles.staffBranchMuted}>Chưa có chi nhánh</Text>
            )}
          </View>
          <View
            style={[
              styles.badge,
              { backgroundColor: `${statusColor(item.branchAssignmentStatus)}22` },
            ]}
          >
            <Text style={[styles.badgeText, { color: statusColor(item.branchAssignmentStatus) }]}>
              {BRANCH_ASSIGNMENT_STATUS_LABELS[item.branchAssignmentStatus]}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

/** Quản lý đề xuất gán chi nhánh — chủ quán duyệt tại màn riêng. */
export default function StaffManagementScreen() {
  const canManage = usePermission('staff:manage');
  const isOwner = useIsOwner();
  const { data: staff, isLoading, isError, refetch } = useStaffList();
  const { data: branches, isLoading: branchesLoading, refetch: refetchBranches } = useBranches();
  const propose = useProposeBranchAssignment();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  useEffect(() => {
    if (!canManage) {
      router.replace('/(manager)/dashboard');
    }
  }, [canManage]);

  useEffect(() => {
    void refetchBranches();
  }, [refetchBranches]);

  const assignableBranches = useMemo(() => branches ?? [], [branches]);

  useEffect(() => {
    if (!selectedStaffId || !branches?.length) return;
    const staffMember = staff?.find((s) => s.id === selectedStaffId);
    const preferred = staffMember?.branchId
      ? (branches.find((b) => b.id === staffMember.branchId) ?? branches[0])
      : branches[0];
    setSelectedBranchId(preferred.id);
  }, [selectedStaffId, branches, staff]);

  const selectedStaff = staff?.find((s) => s.id === selectedStaffId) ?? null;

  const handlePropose = async () => {
    if (!selectedStaff || !selectedBranchId) return;
    const branch = branches?.find((b) => b.id === selectedBranchId);
    const title = isOwner ? 'Gán chi nhánh' : 'Đề xuất gán chi nhánh';
    const message = isOwner
      ? `Gán ${selectedStaff.fullName} vào ${branch?.name ?? 'chi nhánh'}? (Có hiệu lực ngay)`
      : `Gán ${selectedStaff.fullName} vào ${branch?.name ?? 'chi nhánh'}?\n\nĐề xuất sẽ được gửi chủ quán duyệt.`;

    const ok = await confirmAction(title, message);
    if (!ok) return;

    propose.mutate(
      { staffId: selectedStaff.id, branchId: selectedBranchId },
      {
        onSuccess: () => {
          showMessage(
            isOwner ? 'Đã gán' : 'Đã gửi',
            isOwner
              ? `${selectedStaff.fullName} đã được gán chi nhánh.`
              : 'Chờ chủ quán duyệt gán chi nhánh.',
          );
          setSelectedStaffId(null);
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Không gửi được đề xuất';
          showMessage('Lỗi', msg);
        },
      },
    );
  };

  if (!canManage) return null;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !staff) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được danh sách nhân viên" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isOwner ? (
        <Pressable onPress={() => router.push('/(manager)/branch-approvals')}>
          <Card style={styles.ownerBanner}>
            <Ionicons name="checkmark-done-outline" size={22} color={colors.primary} />
            <View style={styles.ownerBannerText}>
              <Text style={styles.ownerBannerTitle}>Chủ quán: duyệt đề xuất từ quản lý</Text>
              <Text style={styles.ownerBannerDesc}>
                Vào màn Duyệt gán chi nhánh để phê duyệt / từ chối
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Card>
        </Pressable>
      ) : (
        <Text style={styles.intro}>
          Quản lý <Text style={styles.bold}>đề xuất</Text> gán chi nhánh — chọn CN muốn gán, chủ
          quán duyệt sau.
        </Text>
      )}

      {staff.length === 0 ? (
        <EmptyState
          icon="people-outline"
          title="Chưa có nhân viên"
          subtitle="Thêm tài khoản nhân viên trước khi gán chi nhánh"
        />
      ) : (
        <View style={styles.list}>
          {staff.map((item) => (
            <StaffRow
              key={item.id}
              item={item}
              selected={selectedStaffId === item.id}
              onSelect={() => setSelectedStaffId(item.id)}
            />
          ))}
        </View>
      )}

      {selectedStaff ? (
        <Card style={styles.proposePanel}>
          <Text style={styles.panelTitle}>
            {isOwner ? 'Gán' : 'Đề xuất gán'}: {selectedStaff.fullName}
          </Text>
          {selectedStaff.branchAssignmentStatus === BranchAssignmentStatus.PENDING_OWNER &&
          !isOwner ? (
            <Text style={styles.panelHint}>
              Đang chờ chủ quán duyệt gán vào {selectedStaff.branchName ?? '—'}
            </Text>
          ) : (
            <>
              <Text style={styles.panelLabel}>Chọn chi nhánh {isOwner ? '' : 'đề xuất'}</Text>
              {branchesLoading ? (
                <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.md }} />
              ) : assignableBranches.length === 0 ? (
                <Text style={styles.panelHint}>Không tải được danh sách chi nhánh</Text>
              ) : (
                <View style={styles.branchList}>
                  {assignableBranches.map((branch) => {
                    const isSelected = selectedBranchId === branch.id;
                    return (
                      <Pressable key={branch.id} onPress={() => setSelectedBranchId(branch.id)}>
                        <View style={[styles.branchCard, isSelected && styles.branchCardSelected]}>
                          <Ionicons
                            name="location-outline"
                            size={22}
                            color={isSelected ? colors.primary : colors.textSecondary}
                          />
                          <View style={styles.branchCardContent}>
                            <Text
                              style={[
                                styles.branchCardTitle,
                                isSelected && styles.branchCardTitleSelected,
                              ]}
                            >
                              {branch.name}
                            </Text>
                            <Text style={styles.branchCardAddress}>{branch.address ?? '—'}</Text>
                          </View>
                          {isSelected ? (
                            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                          ) : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
              <Button
                title={isOwner ? 'Gán chi nhánh' : 'Gửi chủ quán duyệt'}
                loading={propose.isPending}
                disabled={!selectedBranchId}
                onPress={() => void handlePropose()}
                style={{ marginTop: spacing.md }}
              />
            </>
          )}
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  intro: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  bold: { fontWeight: '700', color: colors.text },
  ownerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.base,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  ownerBannerText: { flex: 1 },
  ownerBannerTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  ownerBannerDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  list: { gap: spacing.sm },
  staffCard: { marginBottom: 0 },
  staffCardSelected: { borderColor: colors.primary, borderWidth: 2 },
  staffRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.primary },
  staffInfo: { flex: 1 },
  staffName: { fontSize: 15, fontWeight: '600', color: colors.text },
  staffMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  staffBranch: { fontSize: 12, color: colors.text, marginTop: 2 },
  staffBranchMuted: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  proposePanel: { marginTop: spacing.lg },
  panelTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  panelHint: { fontSize: 14, color: colors.warning, marginTop: spacing.sm },
  panelLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  branchList: { gap: spacing.sm },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  branchCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primaryLight,
  },
  branchCardContent: { flex: 1 },
  branchCardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  branchCardTitleSelected: { color: colors.primary },
  branchCardAddress: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
