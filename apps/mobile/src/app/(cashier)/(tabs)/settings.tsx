import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

export default function CashierSettingsScreen() {
  const clearSession = useSessionStore((s) => s.clearSession);

  const handleLogout = () => {
    clearSession();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
      <Text style={styles.version}>CaffeApp v1.0.0-mvp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  logoutButton: {
    backgroundColor: colors.errorLight,
    padding: spacing.base,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: colors.error, fontWeight: '600', fontSize: 16 },
  version: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.lg, fontSize: 12 },
});
