import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@caffeapp/shared';
import { Button } from '@shared/components/ui';
import { clearPersistedSession } from '@shared/lib/storage';
import { setApiAccessToken } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

/** Staff logged in but branch assignment not approved yet (BRANCH_ASSIGNMENT). */
export default function PendingBranchScreen() {
  const clearSession = useSessionStore((s) => s.clearSession);

  const handleLogout = async () => {
    await clearPersistedSession();
    setApiAccessToken(null);
    clearSession();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chờ gán chi nhánh</Text>
      <Text style={styles.body}>
        Tài khoản của bạn chưa được chủ quán duyệt gán chi nhánh. Vui lòng liên hệ quản lý hoặc
        chủ quán để hoàn tất phân công trước khi sử dụng app.
      </Text>
      <Button title="Đăng xuất" onPress={() => void handleLogout()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
    gap: spacing.base,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
});
