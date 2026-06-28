import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';
import { Button, Input } from '@shared/components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Vui lòng nhập email hoặc SĐT');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setLoading(true);
    // Sprint 1: integrate Supabase auth
    setTimeout(() => {
      setLoading(false);
      router.push('/(auth)/branch');
    }, 800);
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
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="minh@cafe.vn"
        />
        <Input
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          error={error}
        />
        <Pressable>
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </Pressable>
        <Button title="Đăng nhập" onPress={handleLogin} loading={loading} />
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
