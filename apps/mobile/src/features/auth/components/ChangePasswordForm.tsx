import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isAxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { colors, spacing } from '@caffeapp/shared';
import { Button, Card, Input, showToast } from '@shared/components/ui';
import { authService } from '@shared/lib/api';

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join('\n');
    }
    if (typeof message === 'string') {
      return message;
    }
  }
  return 'Không đổi được mật khẩu';
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => authService.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormError(null);
      showToast({ title: 'Đã đổi mật khẩu', variant: 'success' });
    },
    onError: (error) => {
      setFormError(getErrorMessage(error));
    },
  });

  function submit() {
    if (newPassword.length < 6) {
      setFormError('Mật khẩu mới cần ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Xác nhận mật khẩu chưa khớp');
      return;
    }
    setFormError(null);
    mutation.mutate();
  }

  const disabled =
    mutation.isPending ||
    currentPassword.length === 0 ||
    newPassword.length === 0 ||
    confirmPassword.length === 0;

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Đổi mật khẩu</Text>
      <View style={styles.fields}>
        <Input
          label="Mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="password"
        />
        <Input
          label="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
        />
        <Input
          label="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          error={formError ?? undefined}
        />
      </View>
      <Button
        title="Cập nhật mật khẩu"
        onPress={submit}
        loading={mutation.isPending}
        disabled={disabled}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.base },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  fields: { gap: spacing.base },
});
