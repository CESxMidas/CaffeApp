import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, borderRadius, formatCurrency } from '@caffeapp/shared';
import { Card, Skeleton } from '@shared/components/ui';
import { useState, useEffect } from 'react';

export default function ManagerDashboardScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Skeleton height={120} style={{ borderRadius: borderRadius.md }} />
        <View style={{ marginTop: spacing.lg, flexDirection: 'row', gap: spacing.md }}>
          <Skeleton height={80} style={{ flex: 1, borderRadius: borderRadius.md }} />
          <Skeleton height={80} style={{ flex: 1, borderRadius: borderRadius.md }} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Doanh thu hôm nay</Text>
        <Text style={styles.revenueValue}>{formatCurrency(12450000)}</Text>
        <Text style={styles.revenueChange}>+18.6% so với hôm qua</Text>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>156</Text>
          <Text style={styles.statLabel}>Đơn hàng</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statValue}>89</Text>
          <Text style={styles.statLabel}>Khách</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base },
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
});
