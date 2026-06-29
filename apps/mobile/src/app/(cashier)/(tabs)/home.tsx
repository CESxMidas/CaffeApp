import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, OrderType } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import type { PermissionAction } from '@shared/config/permissions.config';
import { useUnreadNotificationCount } from '@features/notifications';
import { usePermission } from '@shared/hooks/usePermission';
import { opFrontTab, opStack } from '@shared/lib/navigation/operationalRoutes';
import { useSessionStore } from '@shared/stores/session';
import { useCartStore } from '@shared/stores/cart';

type ActionDef = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: () => Href;
  permission: PermissionAction;
  requiresOrder?: boolean;
  readyFilter?: boolean;
};

const ACTIONS: ActionDef[] = [
  {
    label: 'Tạo đơn',
    icon: 'document-text-outline',
    route: () => opStack('/order-type'),
    permission: 'orders:create',
  },
  {
    label: 'Danh sách đơn',
    icon: 'list-outline',
    route: () => opFrontTab('orders'),
    permission: 'orders:list',
  },
  {
    label: 'Lịch sử',
    icon: 'time-outline',
    route: () => opStack('/history'),
    permission: 'orders:list',
  },
  {
    label: 'Sơ đồ bàn',
    icon: 'grid-outline',
    route: () => opStack('/tables'),
    permission: 'tables:view',
    requiresOrder: true,
  },
  {
    label: 'Thông báo',
    icon: 'notifications-outline',
    route: () => opStack('/notifications'),
    permission: 'orders:list',
  },
  {
    label: 'Món đã xong',
    icon: 'restaurant-outline',
    route: () => opFrontTab('orders'),
    permission: 'orders:list',
  },
];

function ActionTile({ action, badge }: { action: ActionDef; badge?: number }) {
  const allowed = usePermission(action.permission);
  const startOrder = useCartStore((s) => s.startOrder);
  const activeBranchId = useSessionStore((s) => s.activeBranchId);

  if (!allowed) return null;

  const onPress = () => {
    if (action.requiresOrder && activeBranchId) {
      startOrder({ branchId: activeBranchId, orderType: OrderType.DINE_IN });
    }
    router.push(action.route());
  };

  return (
    <Pressable style={styles.gridItem} onPress={onPress}>
      <Card style={styles.actionCard}>
        <View style={styles.iconWrap}>
          <Ionicons name={action.icon} size={32} color={colors.primary} />
          {badge && badge > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.actionLabel}>{action.label}</Text>
      </Card>
    </Pressable>
  );
}

export default function CashierHomeScreen() {
  const employeeName = useSessionStore((s) => s.employeeName);
  const activeBranchName = useSessionStore((s) => s.activeBranchName);
  const { data: unreadCount } = useUnreadNotificationCount();

  const branchLabel = activeBranchName?.startsWith('CN')
    ? `Chi nhánh ${activeBranchName.replace('CN ', '')}`
    : (activeBranchName ?? 'Chi nhánh');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>Xin chào, {employeeName?.split(' ').pop() ?? 'bạn'} 👋</Text>
        <Text style={styles.branch}>{branchLabel}</Text>
      </View>

      <View style={styles.grid}>
        {ACTIONS.map((action) => (
          <ActionTile
            key={action.label}
            action={action}
            badge={action.label === 'Thông báo' ? unreadCount : undefined}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  greeting: { marginBottom: spacing.lg, marginTop: spacing.sm },
  hello: { fontSize: 24, fontWeight: '700', color: colors.text },
  branch: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: { width: '47%' },
  actionCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    minHeight: 120,
    justifyContent: 'center',
  },
  iconWrap: { position: 'relative', marginBottom: spacing.sm },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.text, textAlign: 'center' },
});
