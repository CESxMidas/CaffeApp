import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@caffeapp/shared';
import { logout } from '@shared/lib/auth/logout';

export default function BaristaSettingsScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={() => void logout()}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
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
  logoutText: { color: colors.error, fontWeight: '600' },
});
