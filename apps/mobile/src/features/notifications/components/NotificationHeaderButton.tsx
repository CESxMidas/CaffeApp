import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';
import { opStack } from '@shared/lib/navigation/operationalRoutes';
import { useUnreadNotificationCount } from '../hooks/useNotifications';

interface NotificationHeaderButtonProps {
  href?: Href;
}

export function NotificationHeaderButton({ href }: NotificationHeaderButtonProps) {
  const { data } = useUnreadNotificationCount();
  const count = data ?? 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href ?? opStack('/notifications'))}
      style={styles.button}
    >
      <Ionicons name="notifications-outline" size={24} color={colors.text} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
  },
  badgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
});
