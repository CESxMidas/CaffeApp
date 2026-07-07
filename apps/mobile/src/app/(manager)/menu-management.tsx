import { useState, useMemo } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ProductDto, ProductCategoryDto } from '@caffeapp/shared';
import { colors, spacing, borderRadius, formatCurrency } from '@caffeapp/shared';
import { useProducts, useCategories } from '@features/orders';
import { Button, Card, EmptyState, ErrorScreen, SkeletonList } from '@shared/components/ui';
import { getErrorMessage } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '@features/manager';

export default function MenuManagementScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const { data: products, isLoading, isError, refetch } = useProducts(activeBranchId);
  const { data: categories } = useCategories(activeBranchId);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  const openCreate = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setCategoryId(categories?.[0]?.id ?? '');
    setDescription('');
    setModalVisible(true);
  };

  const openEdit = (product: ProductDto) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(String(product.price));
    setCategoryId(product.categoryId);
    setDescription(product.description ?? '');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!activeBranchId || !name.trim() || !price || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá không hợp lệ');
      return;
    }

    const payload = {
      name: name.trim(),
      price: priceNum,
      categoryId,
      description: description.trim() || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { productId: editingProduct.id, ...payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            void refetch();
          },
          onError: (err: unknown) => {
            Alert.alert('Lỗi', getErrorMessage(err, 'Lỗi cập nhật'));
          },
        },
      );
    } else {
      createProduct.mutate(
        { branchId: activeBranchId, ...payload },
        {
          onSuccess: () => {
            setModalVisible(false);
            void refetch();
          },
          onError: (err: unknown) => {
            Alert.alert('Lỗi', getErrorMessage(err, 'Lỗi tạo mới'));
          },
        },
      );
    }
  };

  const handleDelete = (product: ProductDto) => {
    Alert.alert('Xác nhận', `Xoá món "${product.name}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => {
          deleteProduct.mutate(product.id, {
            onSuccess: () => void refetch(),
            onError: (err: unknown) => {
              Alert.alert('Lỗi', getErrorMessage(err, 'Lỗi xoá'));
            },
          });
        },
      },
    ]);
  };

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c: ProductCategoryDto) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SkeletonList rows={8} />
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
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý menu</Text>
        <Pressable style={styles.addBtn} onPress={openCreate}>
          <Ionicons name="add" size={24} color={colors.white} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {products.length === 0 ? (
          <EmptyState icon="fast-food-outline" title="Chưa có món" subtitle="Thêm món mới" />
        ) : (
          products.map((product) => {
            const catName = categoryMap.get(product.categoryId) ?? '';
            return (
              <Card key={product.id} style={styles.productCard}>
                <View style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCat}>{catName}</Text>
                    <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                  </View>
                  <View style={styles.productActions}>
                    <Pressable style={styles.iconBtn} onPress={() => openEdit(product)}>
                      <Ionicons name="create-outline" size={22} color={colors.primary} />
                    </Pressable>
                    <Pressable style={styles.iconBtn} onPress={() => handleDelete(product)}>
                      <Ionicons name="trash-outline" size={22} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingProduct ? 'Sửa món' : 'Thêm món mới'}</Text>

            <Text style={styles.label}>Tên món</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên món"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />

            <Text style={styles.label}>Danh mục</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories?.map((cat: ProductCategoryDto) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={[styles.catChip, categoryId === cat.id && styles.catChipActive]}
                >
                  <Text style={[styles.catText, categoryId === cat.id && styles.catTextActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.label}>Giá (VNĐ)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.label}>Mô tả (tuỳ chọn)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả món"
              placeholderTextColor={colors.textMuted}
              multiline
              style={[styles.input, styles.textArea]}
            />

            <Button
              title={editingProduct ? 'Cập nhật' : 'Thêm món'}
              loading={createProduct.isPending || updateProduct.isPending}
              onPress={handleSave}
            />
            <Button
              title="Huỷ"
              variant="outline"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { padding: spacing.base, gap: spacing.sm },
  productCard: {},
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600', color: colors.text },
  productCat: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: '600', color: colors.primary, marginTop: 4 },
  productActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: { padding: spacing.sm },
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
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.base,
    color: colors.text,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top', paddingTop: spacing.sm },
  catScroll: { marginBottom: spacing.sm },
  catChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  catChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  catText: { fontSize: 13, color: colors.textSecondary },
  catTextActive: { color: colors.primary, fontWeight: '600' },
});
