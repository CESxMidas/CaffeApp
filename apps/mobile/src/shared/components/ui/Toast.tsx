import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing } from '@caffeapp/shared';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration?: number;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { border: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }
> = {
  success: { border: colors.primary, icon: 'checkmark-circle', iconColor: colors.primary },
  error: { border: colors.error, icon: 'alert-circle', iconColor: colors.error },
  warning: { border: colors.warning, icon: 'warning', iconColor: colors.warning },
  info: { border: colors.accent, icon: 'information-circle', iconColor: colors.accent },
};

let enqueueToast: ((toast: Omit<ToastMessage, 'id'>) => void) | null = null;

export function showToast(toast: Omit<ToastMessage, 'id'>): void {
  enqueueToast?.(toast);
}

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${++idRef.current}`;
      const entry: ToastMessage = { id, duration: 3200, ...toast };
      setToasts((prev) => [...prev.slice(-2), entry]);
      setTimeout(() => dismiss(id), entry.duration);
    },
    [dismiss],
  );

  useEffect(() => {
    enqueueToast = push;
    return () => {
      enqueueToast = null;
    };
  }, [push]);

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.host, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </View>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const slide = useRef(new Animated.Value(-24)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = VARIANT_CONFIG[toast.variant];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [opacity, slide]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY: slide }] }}>
      <Pressable
        onPress={onDismiss}
        style={[styles.toast, { borderLeftColor: config.border } as ViewStyle]}
      >
        <Ionicons name={config.icon} size={22} color={config.iconColor} />
        <View style={styles.textBlock}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
        </View>
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    zIndex: 9999,
    gap: spacing.sm,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  textBlock: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  message: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
});
