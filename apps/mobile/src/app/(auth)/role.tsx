import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Role } from '@caffeapp/shared';
import { ROLE_LABELS, colors, spacing } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';

const ROLES: { role: Role; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
  { role: 'cashier', icon: 'cash-outline', desc: 'Tạo đơn, thanh toán' },
  { role: 'barista', icon: 'cafe-outline', desc: 'Pha chế, hoàn thành đơn' },
  { role: 'manager', icon: 'bar-chart-outline', desc: 'Báo cáo, quản lý' },
];

export default function RoleScreen() {
  const setSession = useSessionStore((s) => s.setSession);

  const handleSelect = (role: Role) => {
    setSession({ branchId: '1', role, name: 'Nguyễn Văn Minh' });
    switch (role) {
      case 'cashier':
        router.replace('/(cashier)/(tabs)/home');
        break;
      case 'barista':
        router.replace('/(barista)/queue');
        break;
      case 'manager':
        router.replace('/(manager)/dashboard');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.desc}>Chọn vai trò làm việc trong ca</Text>
      <View style={styles.list}>
        {ROLES.map(({ role, icon, desc }) => (
          <Pressable key={role} onPress={() => handleSelect(role)}>
            <Card style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.iconWrap}>
                  <Ionicons name={icon} size={28} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{ROLE_LABELS[role]}</Text>
                  <Text style={styles.cardDesc}>{desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  list: { gap: spacing.sm },
  card: {},
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardDesc: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
});
