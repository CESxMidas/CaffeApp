import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';

interface HeaderBackButtonProps {
  label?: string;
  onPress?: () => void;
}

export function HeaderBackButton({ label = 'Quay lại', onPress }: HeaderBackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  return (
    <Pressable onPress={handlePress} style={styles.btn} hitSlop={8}>
      <Ionicons name="chevron-back" size={22} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.xs,
    paddingVertical: spacing.xs,
  },
  label: { fontSize: 16, color: colors.primary, marginLeft: 2 },
});
