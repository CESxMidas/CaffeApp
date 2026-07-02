import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '@caffeapp/shared';
import { ChangePasswordForm } from '@features/auth';
import { logout } from '@shared/lib/auth/logout';

export default function CashierSettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ChangePasswordForm />
      <Pressable style={styles.logoutButton} onPress={() => void logout()}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
      <Text style={styles.version}>CaffeApp v1.0.0-mvp</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, gap: spacing.base, paddingBottom: spacing.xl },
  logoutButton: {
    backgroundColor: colors.errorLight,
    padding: spacing.base,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: { color: colors.error, fontWeight: '600', fontSize: 16 },
  version: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm, fontSize: 12 },
});
