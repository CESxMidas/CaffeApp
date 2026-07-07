import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, colors, formatCurrency, spacing } from '@caffeapp/shared';
import type { PaymentMethod } from '@caffeapp/shared';
import { Card, ErrorScreen } from '@shared/components/ui';
import {
  revenueRangeForPreset,
  useRevenueReport,
  type RevenueRangePreset,
} from '@features/manager';
import { useSessionStore } from '@shared/stores/session';

const RANGE_PRESETS: { key: RevenueRangePreset; label: string }[] = [
  { key: 'today', label: 'Hôm nay' },
  { key: '7d', label: '7 ngày' },
  { key: '30d', label: '30 ngày' },
  { key: 'month', label: 'Tháng này' },
];

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
  E_WALLET: 'Ví điện tử',
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Card style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export default function ReportsScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const [preset, setPreset] = useState<RevenueRangePreset>('today');
  const range = revenueRangeForPreset(preset);
  const { data: report, isLoading, isError, refetch } = useRevenueReport(activeBranchId, range);

  const rangePicker = (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
      {RANGE_PRESETS.map((p) => (
        <Pressable key={p.key} onPress={() => setPreset(p.key)}>
          <View style={[styles.presetChip, preset === p.key && styles.presetChipActive]}>
            <Text style={[styles.presetText, preset === p.key && styles.presetTextActive]}>
              {p.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {rangePicker}
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError || !report) {
    return (
      <View style={styles.container}>
        {rangePicker}
        <ErrorScreen message="Không tải được báo cáo" onRetry={() => refetch()} />
      </View>
    );
  }

  const summary = report.summary;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Báo cáo doanh thu</Text>
      {rangePicker}

      <View style={styles.statsGrid}>
        <StatCard
          label="Tổng doanh thu"
          value={formatCurrency(summary.totalRevenue)}
          icon="cash-outline"
        />
        <StatCard label="Số đơn" value={String(summary.totalOrders)} icon="receipt-outline" />
        <StatCard
          label="Giá trị TB"
          value={formatCurrency(summary.averageOrderValue)}
          icon="trending-up-outline"
        />
        <StatCard
          label="Đã hủy"
          value={String(summary.cancelledOrders)}
          icon="close-circle-outline"
        />
      </View>

      {report.series.length > 1 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doanh thu theo ngày</Text>
          {report.series.map((point) => (
            <Card key={point.period} style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentMethod}>{point.period}</Text>
                <View style={styles.paymentStats}>
                  <Text style={styles.paymentRevenue}>{formatCurrency(point.revenue)}</Text>
                  <Text style={styles.paymentOrders}>{point.orders} đơn</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : null}

      {report.topItems.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top món bán chạy</Text>
          {report.topItems.map((item, idx) => (
            <Card key={item.productId} style={styles.topItemCard}>
              <View style={styles.topItemRow}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{idx + 1}</Text>
                </View>
                <View style={styles.topItemInfo}>
                  <Text style={styles.topItemName}>{item.productName}</Text>
                  <Text style={styles.topItemMeta}>
                    {item.quantity} món · {formatCurrency(item.revenue)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : null}

      {report.byPaymentMethod.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theo phương thức thanh toán</Text>
          {report.byPaymentMethod.map((pm) => (
            <Card key={pm.method} style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentMethod}>
                  {PAYMENT_METHOD_LABELS[pm.method] ?? pm.method}
                </Text>
                <View style={styles.paymentStats}>
                  <Text style={styles.paymentRevenue}>{formatCurrency(pm.revenue)}</Text>
                  <Text style={styles.paymentOrders}>{pm.orders} đơn</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  presetRow: { maxHeight: 40, marginBottom: spacing.md },
  presetChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  presetText: { fontSize: 13, color: colors.textSecondary },
  presetTextActive: { color: colors.primary, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: '48%',
    minWidth: 160,
    alignItems: 'center',
    padding: spacing.md,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  section: { marginTop: spacing.lg },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  topItemCard: { marginBottom: spacing.xs },
  topItemRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: { color: colors.white, fontSize: 13, fontWeight: '700' },
  topItemInfo: { flex: 1 },
  topItemName: { fontSize: 15, fontWeight: '600', color: colors.text },
  topItemMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  paymentCard: { marginBottom: spacing.xs },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: { fontSize: 15, fontWeight: '500', color: colors.text },
  paymentStats: { alignItems: 'flex-end' },
  paymentRevenue: { fontSize: 15, fontWeight: '700', color: colors.primary },
  paymentOrders: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
