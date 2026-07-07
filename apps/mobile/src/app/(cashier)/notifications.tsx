import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { NotificationDto } from '@caffeapp/shared';
import { colors, spacing } from '@caffeapp/shared';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@features/notifications';
import { Button, Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { opStack } from '@shared/lib/navigation/operationalRoutes';

const TYPE_ICON: Record<
  NotificationDto['type'],
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  ORDER_READY: { name: 'checkmark-done-circle', color: colors.primary },
  ORDER_NEW: { name: 'cafe-outline', color: colors.accent },
  BRANCH_ASSIGNMENT: { name: 'people-outline', color: colors.warning },
  SYSTEM: { name: 'information-circle-outline', color: colors.textSecondary },
};

export default function NotificationsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const sorted = useMemo(
    () => [...(data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data],
  );

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
        <ErrorScreen message="Không tải được thông báo" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sorted.length > 0 ? (
        <View style={styles.toolbar}>
          <Button
            title="Đánh dấu đã đọc"
            variant="outline"
            loading={markAll.isPending}
            onPress={() => markAll.mutate()}
            style={styles.toolbarBtn}
          />
        </View>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="Không có thông báo"
          subtitle="Bạn sẽ nhận cập nhật đơn hàng tại đây"
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />}
        >
          {sorted.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              onPress={() => {
                if (!item.readAt) markRead.mutate(item.id);
                const orderId = item.metadata?.orderId;
                if (typeof orderId === 'string') {
                  router.push(opStack(`/order/${orderId}`));
                }
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function NotificationRow({ item, onPress }: { item: NotificationDto; onPress: () => void }) {
  const icon = TYPE_ICON[item.type];
  const unread = !item.readAt;
  const time = new Date(item.createdAt).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });

  return (
    <Pressable onPress={onPress}>
      <Card style={[styles.row, unread && styles.rowUnread]}>
        <View style={[styles.iconWrap, { backgroundColor: `${icon.color}18` }]}>
          <Ionicons name={icon.name} size={22} color={icon.color} />
        </View>
        <View style={styles.rowContent}>
          <View style={styles.rowHeader}>
            <Text style={[styles.rowTitle, unread && styles.rowTitleUnread]}>{item.title}</Text>
            {unread ? <View style={styles.unreadDot} /> : null}
          </View>
          <Text style={styles.rowBody} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.rowTime}>{time}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  toolbar: { padding: spacing.base, paddingBottom: 0 },
  toolbarBtn: { alignSelf: 'flex-end' },
  list: { padding: spacing.base, gap: spacing.sm, paddingBottom: spacing.xl },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  rowUnread: { borderColor: colors.primaryLight, backgroundColor: colors.background },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 },
  rowTitleUnread: { color: colors.text },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  rowBody: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  rowTime: { fontSize: 11, color: colors.textMuted, marginTop: spacing.xs },
});
