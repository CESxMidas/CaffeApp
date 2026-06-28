import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, borderRadius } from '@caffeapp/shared';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, { width, height, opacity }, style]} />;
}

export function SkeletonTableGrid() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} width={80} height={80} style={styles.gridItem} />
      ))}
    </View>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.listRow}>
          <Skeleton width={56} height={56} style={styles.avatar} />
          <View style={styles.listContent}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  gridItem: { borderRadius: borderRadius.md },
  list: { gap: 12 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { borderRadius: borderRadius.sm },
  listContent: { flex: 1 },
});
