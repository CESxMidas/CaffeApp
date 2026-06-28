import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isAxiosError } from 'axios';
import { colors, spacing } from '@caffeapp/shared';
import { useLogin } from '@features/auth';
import { navigateAfterLogin } from '@shared/lib/auth/postLoginNavigation';
import { Button, ErrorBanner, Input } from '@shared/components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const login = useLogin();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError('');
    if (formError) setFormError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError('');
    if (formError) setFormError('');
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    setFormError('');

    let hasFieldError = false;
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email hoặc SĐT');
      hasFieldError = true;
    }
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      hasFieldError = true;
    }
    if (hasFieldError) return;

    try {
      const data = await login.mutateAsync({ email: email.trim().toLowerCase(), password });
      navigateAfterLogin(data);
    } catch (err) {
      if (isAxiosError(err)) {
        if (!err.response) {
          setFormError(
            'Không thể kết nối máy chủ. Chạy API (npm run api) và kiểm tra EXPO_PUBLIC_API_URL.',
          );
          return;
        }
        const message = err.response.data?.message;
        setFormError(typeof message === 'string' ? message : 'Email hoặc mật khẩu không đúng');
      } else {
        setFormError('Không thể kết nối máy chủ. Kiểm tra API và mạng.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logo}>
          <Ionicons name="cafe" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>CaffeApp</Text>
        <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email / SĐT"
          value={email}
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="cashier@caffe.app"
          error={emailError}
        />
        <Input
          label="Mật khẩu"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          placeholder="••••••••"
          error={passwordError}
        />
        <Pressable>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </Pressable>
        {formError ? (
          <ErrorBanner message={formError} onDismiss={() => setFormError('')} />
        ) : null}
        <Button title="Đăng nhập" onPress={handleLogin} loading={login.isPending} />
      </View>

      <View style={styles.biometric}>
        <Ionicons name="finger-print" size={32} color={colors.textMuted} />
        <Text style={styles.biometricText}>Đăng nhập sinh trắc học</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: { fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm },
  form: { gap: spacing.base },
  forgot: {
    alignSelf: 'flex-end',
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  biometric: { alignItems: 'center', marginTop: spacing.xl, gap: spacing.sm },
  biometricText: { fontSize: 14, color: colors.textMuted },
});
