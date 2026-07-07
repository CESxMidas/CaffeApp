import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { colors, spacing } from '@caffeapp/shared';
import { Button, Card, Input, showToast } from '@shared/components/ui';
import { authService, getErrorMessage } from '@shared/lib/api';

function isStrongPassword(value: string): boolean {
  return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [expiresInMinutes, setExpiresInMinutes] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const requestCode = useMutation({
    mutationFn: () => authService.requestPasswordChangeCode({ currentPassword, newPassword }),
    onSuccess: (data) => {
      setCodeSent(true);
      setExpiresInMinutes(data.expiresInMinutes);
      setOtpCode('');
      setFormError(null);
      showToast({ title: 'Đã gửi mã xác nhận đến email', variant: 'success' });
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Không đổi được mật khẩu'));
    },
  });

  const confirmCode = useMutation({
    mutationFn: () => authService.confirmPasswordChange({ code: otpCode }),
    onSuccess: () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setCodeSent(false);
      setExpiresInMinutes(null);
      setFormError(null);
      showToast({ title: 'Đã đổi mật khẩu', variant: 'success' });
    },
    onError: (error) => {
      setFormError(getErrorMessage(error, 'Không đổi được mật khẩu'));
    },
  });

  function requestOtp() {
    if (!isStrongPassword(newPassword)) {
      setFormError('Mật khẩu mới cần ít nhất 8 ký tự, gồm chữ và số');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Xác nhận mật khẩu chưa khớp');
      return;
    }
    setFormError(null);
    requestCode.mutate();
  }

  function confirmOtp() {
    if (!/^\d{6}$/.test(otpCode)) {
      setFormError('Mã xác nhận gồm 6 chữ số');
      return;
    }
    setFormError(null);
    confirmCode.mutate();
  }

  function resetFlow() {
    setCodeSent(false);
    setOtpCode('');
    setExpiresInMinutes(null);
    setFormError(null);
  }

  const busy = requestCode.isPending || confirmCode.isPending;
  const canRequest =
    !busy && currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

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
          editable={!codeSent}
        />
        <Input
          label="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          editable={!codeSent}
        />
        <Input
          label="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          editable={!codeSent}
          error={!codeSent ? (formError ?? undefined) : undefined}
        />
        {codeSent ? (
          <>
            <Text style={styles.helper}>
              Nhập mã 6 số đã gửi đến email. Mã có hiệu lực
              {expiresInMinutes ? ` ${expiresInMinutes} phút.` : '.'}
            </Text>
            <Input
              label="Mã xác nhận email"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={6}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              error={formError ?? undefined}
            />
          </>
        ) : null}
      </View>
      <Button
        title={codeSent ? 'Xác nhận đổi mật khẩu' : 'Gửi mã xác nhận'}
        onPress={codeSent ? confirmOtp : requestOtp}
        loading={busy}
        disabled={codeSent ? busy || otpCode.length === 0 : !canRequest}
      />
      {codeSent ? (
        <Button
          title="Gửi lại mã"
          variant="outline"
          onPress={requestOtp}
          loading={requestCode.isPending}
          disabled={busy}
        />
      ) : null}
      {codeSent ? (
        <Button
          title="Đổi thông tin mật khẩu"
          variant="outline"
          onPress={resetFlow}
          disabled={busy}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.base },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  fields: { gap: spacing.base },
  helper: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
});
