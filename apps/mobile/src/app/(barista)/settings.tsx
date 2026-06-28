import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

export default function BaristaSettingsScreen() {
  const clearSession = useSessionStore((s) => s.clearSession);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          clearSession();
          router.replace('/(auth)/login');
        }}
      >
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
