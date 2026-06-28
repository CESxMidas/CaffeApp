import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, borderRadius, spacing } from '@caffeapp/shared';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <View style={styles.banner}>
      <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8}>
          <Text style={styles.retry}>Thử lại</Text>
        </Pressable>
      ) : null}
      {onDismiss ? (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Ionicons name="close" size={18} color={colors.error} />
        </Pressable>
      ) : null}
    </View>
  );
}

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({
  title = 'Không tải được dữ liệu',
  message = 'Vui lòng kiểm tra kết nối và thử lại',
  onRetry,
}: ErrorScreenProps) {
  return (
    <View style={styles.screen}>
      <Ionicons name="cloud-offline-outline" size={64} color={colors.textMuted} />
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenMessage}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    padding: spacing.base,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  message: { flex: 1, fontSize: 14, color: colors.error },
  retry: { fontSize: 14, fontWeight: '600', color: colors.error },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
  },
  screenMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  retryButtonText: { color: colors.primary, fontWeight: '600' },
});
