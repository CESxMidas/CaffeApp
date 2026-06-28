import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';

const ACTIONS = [
  { label: 'Tạo đơn', icon: 'add-circle-outline' as const, route: '/(cashier)/order-type' },
  { label: 'Danh sách đơn', icon: 'list-outline' as const, route: '/(cashier)/(tabs)/orders' },
  { label: 'Lịch sử', icon: 'time-outline' as const, route: null },
  { label: 'Sơ đồ bàn', icon: 'grid-outline' as const, route: null },
  { label: 'Thông báo', icon: 'notifications-outline' as const, badge: 3, route: null },
  { label: 'Món đã xong', icon: 'checkmark-done-outline' as const, route: null },
];

export default function CashierHomeScreen() {
  const employeeName = useSessionStore((s) => s.employeeName);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>Xin chào, {employeeName ?? 'bạn'} 👋</Text>
        <Text style={styles.branch}>Chi nhánh Quận 1</Text>
      </View>

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            style={styles.gridItem}
            onPress={() => action.route && router.push(action.route as never)}
          >
            <Card style={styles.actionCard}>
              <View style={styles.iconWrap}>
                <Ionicons name={action.icon} size={28} color={colors.primary} />
                {action.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{action.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base },
  greeting: { marginBottom: spacing.lg },
  hello: { fontSize: 22, fontWeight: '600', color: colors.text },
  branch: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: { width: '47%' },
  actionCard: { alignItems: 'center', paddingVertical: spacing.lg },
  iconWrap: { position: 'relative', marginBottom: spacing.sm },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.text, textAlign: 'center' },
});
