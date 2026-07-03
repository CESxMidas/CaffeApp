import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ROLE_LABELS, colors, spacing, borderRadius } from '@caffeapp/shared';
import type { BranchDto } from '@caffeapp/shared';
import { StaffRole } from '@caffeapp/shared';
import { Button, Card } from '@shared/components/ui';
import { useBranches } from '@features/auth';
import { useIsOwner } from '@shared/hooks/usePermission';
import { userService } from '@shared/lib/api';
import { showMessage } from '@shared/lib/ui/confirm';
import { useMutation } from '@tanstack/react-query';

const ALL_ROLES: StaffRole[] = [StaffRole.MANAGER, StaffRole.CASHIER, StaffRole.BARISTA];

interface FormData {
  email: string;
  fullName: string;
  password: string;
  role: StaffRole;
  branchId: string;
  phone: string;
}

export default function CreateUserScreen() {
  const isOwner = useIsOwner();
  const { data: branches } = useBranches(true);
  const [form, setForm] = useState<FormData>({
    email: '',
    fullName: '',
    password: '',
    role: StaffRole.CASHIER,
    branchId: '',
    phone: '',
  });

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: (result) => {
      showMessage('Thành công', `Đã tạo tài khoản cho ${result.user.fullName}`);
      router.back();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Không tạo được tài khoản';
      showMessage('Lỗi', msg);
    },
  });

  useEffect(() => {
    if (!isOwner) {
      router.replace('/(manager)/dashboard');
    }
  }, [isOwner]);

  const handleSubmit = () => {
    if (!form.email.trim() || !form.fullName.trim() || !form.password.trim()) {
      showMessage('Lỗi', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    if (form.password.length < 6) {
      showMessage('Lỗi', 'Mật khẩu tối thiểu 6 ký tự');
      return;
    }

    createMutation.mutate({
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      password: form.password,
      role: form.role,
      branchId: form.branchId || undefined,
      phone: form.phone.trim() || undefined,
    });
  };

  if (!isOwner) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>
      <Text style={styles.subtitle}>Chủ quán tạo tài khoản và gán vai trò cho nhân viên</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
          placeholder="nhanvien@caffeapp.vn"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Họ tên *</Text>
        <TextInput
          style={styles.input}
          value={form.fullName}
          onChangeText={(text) => setForm({ ...form, fullName: text })}
          placeholder="Nguyễn Văn A"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Mật khẩu *</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
          placeholder="Tối thiểu 6 ký tự"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          placeholder="0901234567"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Vai trò</Text>
        <View style={styles.roleRow}>
          {ALL_ROLES.map((role) => (
            <Card
              key={role}
              style={[styles.roleCard, form.role === role && styles.roleCardActive]}
              onPress={() => setForm({ ...form, role })}
            >
              <Text
                style={[styles.roleText, form.role === role && styles.roleTextActive]}
              >
                {ROLE_LABELS[role]}
              </Text>
            </Card>
          ))}
        </View>

        <Text style={styles.label}>Chi nhánh (nếu có)</Text>
        <View style={styles.branchRow}>
          {branches?.map((branch: BranchDto) => (
            <Card
              key={branch.id}
              style={[styles.branchCard, form.branchId === branch.id && styles.branchCardActive]}
              onPress={() => setForm({ ...form, branchId: branch.id })}
            >
              <Ionicons
                name={form.branchId === branch.id ? 'location' : 'location-outline'}
                size={16}
                color={form.branchId === branch.id ? colors.white : colors.primary}
              />
              <Text
                style={[styles.branchText, form.branchId === branch.id && styles.branchTextActive]}
                numberOfLines={1}
              >
                {branch.name}
              </Text>
            </Card>
          ))}
          {(!branches || branches.length === 0) && (
            <Text style={styles.noBranch}>Chưa có chi nhánh nào</Text>
          )}
        </View>

        <Button
          title="Tạo tài khoản"
          onPress={handleSubmit}
          loading={createMutation.isPending}
          style={styles.submitBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  form: { gap: spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: -spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  roleRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  roleCard: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderColor: colors.border,
  },
  roleCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: { fontSize: 14, color: colors.text },
  roleTextActive: { color: colors.white, fontWeight: '600' },
  branchRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  branchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderColor: colors.border,
  },
  branchCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  branchText: { fontSize: 13, color: colors.text, maxWidth: 120 },
  branchTextActive: { color: colors.white },
  noBranch: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic' },
  submitBtn: { marginTop: spacing.lg },
});