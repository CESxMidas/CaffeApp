import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@caffeapp/shared';
import type { BranchDto } from '@caffeapp/shared';
import { Button, Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { useBranches } from '@features/auth';
import { useIsOwner } from '@shared/hooks/usePermission';
import { branchService } from '@shared/lib/api';
import { confirmAction, showMessage } from '@shared/lib/ui/confirm';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function BranchCard({
  branch,
  onEdit,
  onDelete,
}: {
  branch: BranchDto;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconWrap}>
          <Ionicons name="business-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{branch.name}</Text>
          {branch.address ? <Text style={styles.meta}>{branch.address}</Text> : null}
          {branch.phone ? <Text style={styles.meta}>{branch.phone}</Text> : null}
          {!branch.isActive ? (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveText}>Đã đóng</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <Button title="Sửa" variant="outline" fullWidth={false} style={styles.actionBtn} onPress={onEdit} />
        <Button
          title="Xóa"
          variant="outline"
          fullWidth={false}
          style={styles.actionBtn}
          textStyle={{ color: colors.error }}
          onPress={onDelete}
        />
      </View>
    </Card>
  );
}

interface BranchFormData {
  name: string;
  address: string;
  phone: string;
}

export default function BranchesScreen() {
  const isOwner = useIsOwner();
  const queryClient = useQueryClient();
  const { data: branches, isLoading, isError, refetch } = useBranches(isOwner);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDto | null>(null);
  const [form, setForm] = useState<BranchFormData>({ name: '', address: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  const createMutation = useMutation({
    mutationFn: branchService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] });
      showMessage('Thành công', 'Đã tạo chi nhánh mới');
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi tạo chi nhánh';
      showMessage('Lỗi', msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BranchFormData> }) =>
      branchService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] });
      showMessage('Thành công', 'Đã cập nhật chi nhánh');
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi cập nhật';
      showMessage('Lỗi', msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: branchService.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['branches'] });
      showMessage('Thành công', 'Đã xóa chi nhánh');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lỗi xóa';
      showMessage('Lỗi', msg);
    },
  });

  useEffect(() => {
    if (!isOwner) {
      router.replace('/(manager)/dashboard');
    }
  }, [isOwner]);

  const openCreate = () => {
    setEditingBranch(null);
    setForm({ name: '', address: '', phone: '' });
    setModalVisible(true);
  };

  const openEdit = (branch: BranchDto) => {
    setEditingBranch(branch);
    setForm({ name: branch.name, address: branch.address ?? '', phone: branch.phone ?? '' });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingBranch(null);
    setForm({ name: '', address: '', phone: '' });
    setSubmitting(false);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      showMessage('Lỗi', 'Tên chi nhánh không được để trống');
      return;
    }
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
    };

    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = async (branch: BranchDto) => {
    const ok = await confirmAction('Xóa chi nhánh', `Xóa "${branch.name}"? Thao tác này không thể hoàn tác.`);
    if (!ok) return;
    deleteMutation.mutate(branch.id);
  };

  if (!isOwner) return null;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được danh sách chi nhánh" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Quản lý chi nhánh</Text>
          <Button title="+ Thêm chi nhánh" fullWidth={false} onPress={openCreate} />
        </View>

        {!branches || branches.length === 0 ? (
          <EmptyState icon="business-outline" title="Chưa có chi nhánh" subtitle="Tạo chi nhánh đầu tiên để bắt đầu" />
        ) : (
          <View style={styles.list}>
            {branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onEdit={() => openEdit(branch)}
                onDelete={() => void handleDelete(branch)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={closeModal}>
              <Ionicons name="close" size={28} color={colors.text} />
            </Pressable>
            <Text style={styles.modalTitle}>{editingBranch ? 'Sửa chi nhánh' : 'Tạo chi nhánh mới'}</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.label}>Tên chi nhánh *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholder="VD: CaffeApp Nguyễn Huệ"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
              placeholder="VD: 123 Nguyễn Huệ, Q.1"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              placeholder="VD: 0901234567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />

            <Button
              title={editingBranch ? 'Cập nhật' : 'Tạo chi nhánh'}
              onPress={handleSubmit}
              loading={submitting || createMutation.isPending || updateMutation.isPending}
              style={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  list: { gap: spacing.sm },
  card: {},
  cardHeader: { flexDirection: 'row', gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  inactiveBadge: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  inactiveText: { fontSize: 12, color: colors.error },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    justifyContent: 'flex-end',
  },
  actionBtn: { minWidth: 80 },
  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  modalContent: { padding: spacing.base, gap: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  submitBtn: { marginTop: spacing.lg },
});