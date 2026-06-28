import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';

export default function OrderTypeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.desc}>Chọn loại đơn hàng</Text>
      <View style={styles.cards}>
        <Pressable>
          <Card style={styles.typeCard}>
            <Ionicons name="restaurant-outline" size={40} color={colors.primary} />
            <Text style={styles.typeTitle}>Uống tại bàn</Text>
            <Text style={styles.typeDesc}>Chọn bàn và phục vụ tại chỗ</Text>
          </Card>
        </Pressable>
        <Pressable>
          <Card style={styles.typeCard}>
            <Ionicons name="bag-handle-outline" size={40} color={colors.primary} />
            <Text style={styles.typeTitle}>Mang đi</Text>
            <Text style={styles.typeDesc}>Đơn takeaway không cần bàn</Text>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.lg },
  cards: { gap: spacing.base },
  typeCard: { alignItems: 'center', paddingVertical: spacing.xl },
  typeTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: spacing.md },
  typeDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
