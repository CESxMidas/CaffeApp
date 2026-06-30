import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OrderType, colors, spacing, borderRadius } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';
import { useCartStore } from '@shared/stores/cart';
import { opStack } from '@shared/lib/navigation/operationalRoutes';

export default function OrderTypeScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const startOrder = useCartStore((s) => s.startOrder);

  const handleSelect = (orderType: OrderType) => {
    if (!activeBranchId) return;
    startOrder({ branchId: activeBranchId, orderType });
    if (orderType === OrderType.DINE_IN) {
      router.push(opStack('/tables'));
      return;
    }
    router.push(opStack('/menu'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn loại đơn</Text>
      <Text style={styles.desc}>Bạn đang phục vụ loại khách nào?</Text>
      <View style={styles.cards}>
        <Pressable onPress={() => handleSelect(OrderType.DINE_IN)} style={styles.cardPress}>
          <Card style={styles.typeCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="restaurant-outline" size={48} color={colors.primary} />
            </View>
            <Text style={styles.typeTitle}>Uống tại bàn</Text>
            <Text style={styles.typeDesc}>Chọn bàn trên sơ đồ và phục vụ tại chỗ</Text>
          </Card>
        </Pressable>
        <Pressable onPress={() => handleSelect(OrderType.TAKE_AWAY)} style={styles.cardPress}>
          <Card style={styles.typeCard}>
            <View style={[styles.iconCircle, styles.iconCircleAlt]}>
              <Ionicons name="bag-handle-outline" size={48} color={colors.accent} />
            </View>
            <Text style={styles.typeTitle}>Mang đi</Text>
            <Text style={styles.typeDesc}>Takeaway — không cần chọn bàn</Text>
          </Card>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  desc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  cards: { gap: spacing.base },
  cardPress: { borderRadius: borderRadius.md },
  typeCard: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconCircleAlt: { backgroundColor: colors.accentLight },
  typeTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  typeDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
});
