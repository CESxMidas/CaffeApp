import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, StaffRole } from '@caffeapp/shared';
import { useBranches } from '@features/auth';
import { Button, Card, ErrorScreen } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';

/** Chỉ chủ quán chọn chi nhánh làm việc trong phiên — nhân viên dùng CN đã được duyệt. */
export default function BranchScreen() {
  const staffRole = useSessionStore((s) => s.staffRole);
  const { data: branches, isLoading, isError, refetch } = useBranches();
  const setBranch = useSessionStore((s) => s.setBranch);
  const accessToken = useSessionStore((s) => s.accessToken);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      router.replace('/(auth)/login');
      return;
    }
    if (staffRole !== StaffRole.OWNER) {
      router.replace('/(auth)/role');
    }
  }, [accessToken, staffRole]);

  useEffect(() => {
    if (branches?.length === 1) {
      setBranch(branches[0].id, branches[0].name);
      router.replace('/(auth)/role');
    }
  }, [branches, setBranch]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !branches) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được danh sách chi nhánh" onRetry={() => refetch()} />
      </View>
    );
  }

  const activeSelection = selected ?? branches[0]?.id ?? null;

  return (
    <View style={styles.container}>
      <Text style={styles.desc}>Chọn chi nhánh làm việc trong phiên (chỉ chủ quán)</Text>
      <View style={styles.list}>
        {branches.map((branch) => {
          const isSelected = activeSelection === branch.id;
          return (
            <Pressable key={branch.id} onPress={() => setSelected(branch.id)}>
              <Card style={[styles.card, isSelected && styles.cardSelected]}>
                <View style={styles.cardRow}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={isSelected ? colors.primary : colors.textSecondary}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{branch.name}</Text>
                    <Text style={styles.cardAddress}>{branch.address ?? '—'}</Text>
                  </View>
                  {isSelected ? (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  ) : null}
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>
      <Button
        title="Tiếp tục"
        onPress={() => {
          const branch = branches.find((b) => b.id === activeSelection);
          if (!branch) return;
          setBranch(branch.id, branch.name);
          router.push('/(auth)/role');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  list: { flex: 1, gap: spacing.sm, marginBottom: spacing.base },
  card: { marginBottom: 0 },
  cardSelected: { borderColor: colors.primary, borderWidth: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardAddress: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
});
