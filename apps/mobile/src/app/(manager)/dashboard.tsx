import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, formatCurrency } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import { useIsOwner, usePermission } from '@shared/hooks/usePermission';
import { usePendingBranchAssignments } from '@features/staff';
import { useRevenueReport } from '@features/manager';
import { useSessionStore } from '@shared/stores/session';

export default function ManagerDashboardScreen() {
  const isOwner = useIsOwner();
  const canManageStaff = usePermission('staff:manage');
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const { data: pending } = usePendingBranchAssignments(isOwner);
  const { data: revenue, isLoading } = useRevenueReport(activeBranchId);
  const pendingCount = isOwner ? (pending?.length ?? 0) : 0;
  const employeeName = useSessionStore((s) => s.employeeName);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const summary = revenue?.summary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isOwner ? (
        <View style={styles.ownerBadge}>
          <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
          <Text style={styles.ownerBadgeText}>Chủ quán · {employeeName}</Text>
        </View>
      ) : null}

      <Card style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Doanh thu hôm nay</Text>
        <Text style={styles.revenueValue}>{formatCurrency(summary?.totalRevenue ?? 0)}</Text>
        <Text style={styles.revenueChange}>{summary?.totalOrders ?? 0} đơn đã thanh toán</Text>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{summary?.totalOrders ?? 0}</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{summary?.guestCount ?? 0}</Text>
          <Text style={styles.statLabel}>Khách tại bàn</Text>
        </Card>
      </View>

      {isOwner ? (
        <Pressable onPress={() => router.push('/(manager)/branch-approvals')}>
          <Card style={[styles.linkCard, pendingCount > 0 && styles.pendingCard]}>
            <View style={styles.linkCardRow}>
              <View style={styles.linkIconWrap}>
                <Ionicons name="checkmark-done-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.linkCardContent}>
                <View style={styles.titleWithBadge}>
                  <Text style={styles.linkCardTitle}>Duyệt gán chi nhánh</Text>
                  {pendingCount > 0 ? (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>{pendingCount}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.linkCardDesc}>
                  Phê duyệt đề xuất từ quản lý — chỉ chủ quán mới duyệt được
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>
        </Pressable>
      ) : null}

      {canManageStaff && !isOwner ? (
        <Pressable onPress={() => router.push('/(manager)/staff')}>
          <Card style={styles.linkCard}>
            <View style={styles.linkCardRow}>
              <View style={styles.linkIconWrap}>
                <Ionicons name="people-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.linkCardContent}>
                <Text style={styles.linkCardTitle}>Đề xuất gán chi nhánh</Text>
                <Text style={styles.linkCardDesc}>Chọn CN muốn gán · Gửi chủ quán duyệt</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>
        </Pressable>
      ) : null}

      {isOwner ? (
        <Pressable onPress={() => router.push('/(manager)/owner-tools')}>
          <Card style={styles.ownerCard}>
            <View style={styles.ownerCardRow}>
              <View style={styles.ownerIconWrap}>
                <Ionicons name="business-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.ownerCardContent}>
                <Text style={styles.ownerCardTitle}>Quản trị chủ quán</Text>
                <Text style={styles.ownerCardDesc}>
                  Đa chi nhánh, tạo tài khoản, quản lý nhân viên
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </Card>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ownerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  ownerBadgeText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  revenueCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  revenueLabel: { color: colors.white, fontSize: 14, opacity: 0.9 },
  revenueValue: { color: colors.white, fontSize: 28, fontWeight: '700', marginTop: spacing.sm },
  revenueChange: { color: colors.white, fontSize: 12, opacity: 0.8, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.base },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  ownerCard: { marginTop: spacing.lg },
  ownerCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linkCard: { marginTop: spacing.lg },
  linkCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  linkIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkCardContent: { flex: 1 },
  titleWithBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  linkCardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  pendingCard: { borderColor: colors.warning, borderWidth: 1 },
  pendingBadge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pendingBadgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  linkCardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  ownerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerCardContent: { flex: 1 },
  ownerCardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  ownerCardDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});
