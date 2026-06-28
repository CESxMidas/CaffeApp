import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@caffeapp/shared';
import { logout } from '@shared/lib/auth/logout';

export default function CashierSettingsScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={() => void logout()}>
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
