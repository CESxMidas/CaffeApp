import { useEffect, useMemo, type ComponentProps } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  BRANCH_ASSIGNMENT_STATUS_LABELS,
  ROLE_LABELS,
  colors,
  spacing,
  borderRadius,
} from '@caffeapp/shared';
import type { ShiftDto, StaffListItemDto } from '@caffeapp/shared';
import { useStaffList } from '@features/staff';
import { useShifts } from '@features/manager';
import { Card, ErrorScreen } from '@shared/components/ui';
import { usePermission } from '@shared/hooks/usePermission';

type IconName = ComponentProps<typeof Ionicons>['name'];

function getWeekRange() {
  const start = new Date();
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

function getShiftDate(shift: ShiftDto) {
  return new Date(shift.openedAt ?? shift.createdAt);
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function formatShiftDate(shift: ShiftDto) {
  return getShiftDate(shift).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
}

function statusColor(staff: StaffListItemDto) {
  if (staff.branchAssignmentStatus === 'APPROVED') return colors.primaryDark;
  if (staff.branchAssignmentStatus === 'PENDING_OWNER') return colors.warning;
  if (staff.branchAssignmentStatus === 'REJECTED') return colors.error;
  return colors.textMuted;
}

function InfoRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function StaffDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const canManage = usePermission('staff:manage');
  const { data: staffList, isLoading, isError, refetch } = useStaffList();
  const staff = staffList?.find((item) => item.id === id) ?? null;
  const shiftsQuery = useShifts(staff?.branchId ?? null);

  useEffect(() => {
    if (!canManage) {
      router.replace('/(manager)/dashboard');
    }
  }, [canManage]);

  const weekRange = useMemo(() => getWeekRange(), []);
  const weekRangeLabel = `${formatShortDate(weekRange.start)} - ${formatShortDate(
    new Date(weekRange.end.getTime() - 1),
  )}`;

  const weekShifts = useMemo(() => {
    const startMs = weekRange.start.getTime();
    const endMs = weekRange.end.getTime();
    return [...(shiftsQuery.data ?? [])]
      .filter((shift) => {
        const shiftMs = getShiftDate(shift).getTime();
        return shiftMs >= startMs && shiftMs < endMs;
      })
      .sort((a, b) => getShiftDate(a).getTime() - getShiftDate(b).getTime());
  }, [shiftsQuery.data, weekRange]);

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
        <ErrorScreen message="Không tải được chi tiết nhân viên" onRetry={() => refetch()} />
      </View>
    );
  }

  const tone = statusColor(staff);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{staff.fullName.charAt(0)}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{staff.fullName}</Text>
            <Text style={styles.role}>{ROLE_LABELS[staff.role]}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${tone}22` }]}>
            <Text style={[styles.statusText, { color: tone }]}>
              {BRANCH_ASSIGNMENT_STATUS_LABELS[staff.branchAssignmentStatus]}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
        <InfoRow icon="call-outline" label="SĐT" value={staff.phone ?? 'Chưa có SĐT'} />
        <InfoRow icon="mail-outline" label="Email" value={staff.email} />
        <InfoRow
          icon="business-outline"
          label="Chi nhánh"
          value={staff.branchName ?? 'Chưa có chi nhánh'}
        />
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch ca tuần</Text>
          <Text style={styles.weekLabel}>{weekRangeLabel}</Text>
        </View>

        {!staff.branchId ? (
          <Text style={styles.emptyText}>Chưa gán chi nhánh</Text>
        ) : shiftsQuery.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.shiftLoader} />
        ) : shiftsQuery.isError ? (
          <Text style={styles.errorText}>Không tải được lịch ca</Text>
        ) : weekShifts.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có ca trong tuần này</Text>
        ) : (
          <View style={styles.shiftList}>
            {weekShifts.map((shift) => (
              <View key={shift.id} style={styles.shiftRow}>
                <View style={styles.shiftDateBox}>
                  <Text style={styles.shiftDate}>{formatShiftDate(shift)}</Text>
                </View>
                <View style={styles.shiftInfo}>
                  <Text style={styles.shiftName}>{shift.name}</Text>
                  <Text style={styles.shiftTime}>
                    {shift.startTime} - {shift.endTime}
                  </Text>
                </View>
                <View style={[styles.shiftStatus, shift.status === 'OPEN' && styles.shiftOpen]}>
                  <Text
                    style={[
                      styles.shiftStatusText,
                      shift.status === 'OPEN' && styles.shiftOpenText,
                    ]}
                  >
                    {shift.status === 'OPEN' ? 'Đang mở' : 'Đã đóng'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl, gap: spacing.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profileCard: { marginBottom: 0 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: colors.primary },
  profileInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  role: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  section: { marginBottom: 0 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  weekLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: colors.textSecondary },
  infoValue: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 2 },
  shiftLoader: { marginVertical: spacing.md },
  shiftList: { gap: spacing.sm },
  shiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shiftDateBox: { width: 64 },
  shiftDate: { fontSize: 12, fontWeight: '700', color: colors.text },
  shiftInfo: { flex: 1 },
  shiftName: { fontSize: 14, fontWeight: '600', color: colors.text },
  shiftTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  shiftStatus: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
  },
  shiftOpen: { backgroundColor: colors.primaryLight },
  shiftStatusText: { fontSize: 11, fontWeight: '700', color: colors.textSecondary },
  shiftOpenText: { color: colors.primaryDark },
  emptyText: { fontSize: 14, color: colors.textMuted, paddingVertical: spacing.sm },
  errorText: { fontSize: 14, color: colors.error, paddingVertical: spacing.sm },
});
