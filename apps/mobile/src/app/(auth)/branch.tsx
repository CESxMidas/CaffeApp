import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';
import { Button, Card } from '@shared/components/ui';

const BRANCHES = [
  { id: '1', name: 'CN Quận 1', address: '123 Nguyễn Huệ, Q.1' },
  { id: '2', name: 'CN Quận 3', address: '45 Võ Văn Tần, Q.3' },
  { id: '3', name: 'CN Thủ Đức', address: '78 Võ Văn Ngân' },
];

export default function BranchScreen() {
  const [selected, setSelected] = useState('1');

  return (
    <View style={styles.container}>
      <Text style={styles.desc}>Chọn chi nhánh bạn đang làm việc</Text>
      <View style={styles.list}>
        {BRANCHES.map((branch) => {
          const isSelected = selected === branch.id;
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
                    <Text style={styles.cardAddress}>{branch.address}</Text>
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
      <Button title="Tiếp tục" onPress={() => router.push('/(auth)/role')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  list: { flex: 1, gap: spacing.sm, marginBottom: spacing.base },
  card: { marginBottom: 0 },
  cardSelected: { borderColor: colors.primary, borderWidth: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardAddress: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
});
