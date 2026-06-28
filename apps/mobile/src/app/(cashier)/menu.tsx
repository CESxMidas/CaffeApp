import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ProductDto, DrinkSize } from '@caffeapp/shared';
import { colors, spacing, borderRadius, formatCurrency, priceForSize } from '@caffeapp/shared';
import { useProducts } from '@features/orders';
import { Button, Card, ErrorScreen, SkeletonList } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';
import { useCartStore } from '@shared/stores/cart';

const SIZES = ['S', 'M', 'L'] as const;
const SUGAR = ['Không', 'Ít', 'Vừa', 'Nhiều'] as const;
const ICE = ['Không', 'Ít', 'Vừa', 'Nhiều'] as const;

export default function MenuScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const tableCode = useCartStore((s) => s.tableCode);
  const itemCount = useCartStore((s) => s.itemCount());
  const addItem = useCartStore((s) => s.addItem);
  const { data: products, isLoading, isError, refetch } = useProducts(activeBranchId);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customProduct, setCustomProduct] = useState<ProductDto | null>(null);
  const [size, setSize] = useState<DrinkSize>('M');
  const [sugar, setSugar] = useState<(typeof SUGAR)[number]>('Vừa');
  const [ice, setIce] = useState<(typeof ICE)[number]>('Vừa');
  const [qty, setQty] = useState(1);

  const categories = useMemo(() => {
    if (!products) return [];
    const names = [...new Set(products.map((p) => p.categoryName ?? 'Khác'))];
    return names;
  }, [products]);

  const activeCat = activeCategory ?? categories[0] ?? null;

  const filtered = useMemo(() => {
    if (!products || !activeCat) return [];
    return products.filter((p) => (p.categoryName ?? 'Khác') === activeCat);
  }, [products, activeCat]);

  const unitPrice = useMemo(() => {
    if (!customProduct) return 0;
    return priceForSize(customProduct.price, size);
  }, [customProduct, size]);

  const lineTotal = unitPrice * qty;

  const openCustomize = (product: ProductDto) => {
    setCustomProduct(product);
    setSize('M');
    setSugar('Vừa');
    setIce('Vừa');
    setQty(1);
  };

  const confirmAdd = () => {
    if (!customProduct) return;
    const notes = `Size ${size}, Đường ${sugar}, Đá ${ice}`;
    addItem({
      productId: customProduct.id,
      productName: customProduct.name,
      unitPrice,
      quantity: qty,
      notes,
    });
    setCustomProduct(null);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.skeletonPad}>
          <SkeletonList rows={6} />
        </View>
      </View>
    );
  }

  if (isError || !products) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được menu" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tableCode ? (
        <View style={styles.banner}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.bannerText}>Bàn {tableCode}</Text>
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {categories.map((cat) => (
          <Pressable key={cat} onPress={() => setActiveCategory(cat)}>
            <View style={[styles.tab, activeCat === cat && styles.tabActive]}>
              <Text style={[styles.tabText, activeCat === cat && styles.tabTextActive]}>{cat}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.map((product) => (
          <Card key={product.id} style={styles.productCard}>
            <View style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
              </View>
              <Pressable style={styles.addBtn} onPress={() => openCustomize(product)}>
                <Ionicons name="add" size={22} color={colors.white} />
              </Pressable>
            </View>
          </Card>
        ))}
      </ScrollView>

      <Pressable style={styles.cartFab} onPress={() => router.push('/(cashier)/cart')}>
        <Ionicons name="cart-outline" size={24} color={colors.white} />
        <Text style={styles.cartFabText}>Giỏ ({itemCount})</Text>
      </Pressable>

      <Modal visible={Boolean(customProduct)} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{customProduct?.name}</Text>
            <Text style={styles.modalPrice}>{formatCurrency(lineTotal)}</Text>
            {qty > 1 ? (
              <Text style={styles.modalUnitPrice}>
                {formatCurrency(unitPrice)} × {qty}
              </Text>
            ) : null}

            <Text style={styles.optionLabel}>Size</Text>
            <OptionRow options={SIZES} value={size} onChange={setSize} />
            <Text style={styles.optionLabel}>Đường</Text>
            <OptionRow options={SUGAR} value={sugar} onChange={setSugar} />
            <Text style={styles.optionLabel}>Đá</Text>
            <OptionRow options={ICE} value={ice} onChange={setIce} />

            <View style={styles.qtyRow}>
              <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))}>
                <Ionicons name="remove-circle-outline" size={28} color={colors.primary} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => q + 1)}>
                <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
              </Pressable>
            </View>

            <Button title="Thêm vào giỏ" onPress={confirmAdd} />
            <Button
              title="Huỷ"
              variant="outline"
              onPress={() => setCustomProduct(null)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function OptionRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.optionRow}>
      {options.map((opt) => (
        <Pressable key={opt} onPress={() => onChange(opt)}>
          <View style={[styles.optionChip, value === opt && styles.optionChipActive]}>
            <Text style={[styles.optionText, value === opt && styles.optionTextActive]}>{opt}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  bannerText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  tabs: { maxHeight: 48, paddingHorizontal: spacing.base, marginVertical: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tabText: { fontSize: 14, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  list: { padding: spacing.base, paddingBottom: 100, gap: spacing.sm },
  skeletonPad: { padding: spacing.base },
  productCard: {},
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600', color: colors.text },
  productPrice: { fontSize: 15, fontWeight: '600', color: colors.primary, marginTop: 4 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartFab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  cartFabText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  modalPrice: { fontSize: 16, color: colors.primary, fontWeight: '600', marginTop: 4 },
  modalUnitPrice: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  optionLabel: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.xs },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  optionChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionText: { fontSize: 13, color: colors.textSecondary },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginVertical: spacing.lg,
  },
  qtyText: { fontSize: 20, fontWeight: '700', color: colors.text, minWidth: 32, textAlign: 'center' },
});
