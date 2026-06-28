import { useMemo, useState, useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { isAxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons';
import {
  TableStatus,
  colors,
  spacing,
  borderRadius,
  TABLE_STATUS_LABELS,
} from '@caffeapp/shared';
import type { TableDto } from '@caffeapp/shared';
import { useTables } from '@features/orders';
import { Button, EmptyState, ErrorScreen, SkeletonTableGrid } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';
import { useCartStore } from '@shared/stores/cart';

const FLOORS = ['Tầng 1', 'Tầng 2'] as const;

function tableStyles(status: TableStatus, selected: boolean) {
  if (selected) {
    return {
      bg: colors.accentLight,
      border: colors.tableSelected,
      text: colors.accent,
      icon: colors.tableSelected,
    };
  }
  if (status === TableStatus.OCCUPIED) {
    return {
      bg: colors.primaryLight,
      border: colors.primary,
      text: colors.primaryDark,
      icon: colors.primary,
    };
  }
  if (status === TableStatus.MAINTENANCE) {
    return {
      bg: '#F3F4F6',
      border: colors.textMuted,
      text: colors.textMuted,
      icon: colors.textMuted,
    };
  }
  return {
    bg: colors.tableEmpty,
    border: 'transparent',
    text: colors.textSecondary,
    icon: colors.textSecondary,
  };
}

function occupiedMinutes(table: TableDto): number | null {
  if (table.status !== TableStatus.OCCUPIED || !table.occupiedSince) return null;
  const elapsedMs = Date.now() - new Date(table.occupiedSince).getTime();
  return Math.max(1, Math.floor(elapsedMs / 60_000));
}

export default function TablesScreen() {
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const accessToken = useSessionStore((s) => s.accessToken);
  const isOwner = useSessionStore((s) => s.isOwner);
  const startOrder = useCartStore((s) => s.startOrder);
  const orderType = useCartStore((s) => s.orderType);
  const { data: tables, isPending, isError, refetch, error } = useTables(activeBranchId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<(typeof FLOORS)[number]>('Tầng 1');

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const filtered = useMemo(() => {
    if (!tables) return [];
    return tables.filter((t) => (t.floor ?? 'Tầng 1') === activeFloor);
  }, [tables, activeFloor]);

  const selected = tables?.find((t) => t.id === selectedId) ?? null;

  const handleContinue = () => {
    const branchId = activeBranchId ?? tables?.[0]?.branchId ?? null;
    if (!selected || !branchId || !orderType) return;
    if (selected.status === TableStatus.OCCUPIED) {
      Alert.alert('Bàn đang có khách', 'Vui lòng chọn bàn trống');
      return;
    }
    if (selected.status === TableStatus.MAINTENANCE) {
      Alert.alert('Bàn bảo trì', 'Bàn này đang bảo trì, không thể chọn');
      return;
    }
    startOrder({
      branchId,
      orderType,
      tableId: selected.id,
      tableCode: selected.code,
    });
    router.push('/(cashier)/menu');
  };

  if (!accessToken) {
    return (
      <View style={styles.container}>
        <ErrorScreen
          message="Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
          onRetry={() => router.replace('/(auth)/login')}
        />
      </View>
    );
  }

  if (isOwner && !activeBranchId) {
    return (
      <View style={styles.container}>
        <ErrorScreen
          message="Chủ quán cần chọn chi nhánh trước khi xem sơ đồ bàn."
          onRetry={() => router.replace('/(auth)/branch')}
        />
      </View>
    );
  }

  if (isPending) {
    return (
      <View style={styles.container}>
        <Legend />
        <View style={styles.skeletonWrap}>
          <SkeletonTableGrid />
        </View>
      </View>
    );
  }

  if (isError) {
    const apiMessage = isAxiosError(error)
      ? (error.response?.data as { message?: string } | undefined)?.message
      : undefined;
    return (
      <View style={styles.container}>
        <ErrorScreen
          message={apiMessage ?? 'Không tải được sơ đồ bàn'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!tables) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được sơ đồ bàn" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Legend />

      <Pressable style={styles.floorPicker}>
        <Ionicons name="layers-outline" size={18} color={colors.primary} />
        <Text style={styles.floorPickerText}>{activeFloor}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.primary} />
      </Pressable>
      <View style={styles.floorTabs}>
        {FLOORS.map((floor) => (
          <Pressable key={floor} onPress={() => setActiveFloor(floor)}>
            <View style={[styles.floorTabWrap, activeFloor === floor && styles.floorTabActive]}>
              <Text
                style={[styles.floorTabText, activeFloor === floor && styles.floorTabTextActive]}
              >
                {floor}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.gridList} contentContainerStyle={styles.gridContent}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="grid-outline"
            title="Không có bàn"
            subtitle={`Chưa có bàn trên ${activeFloor}`}
          />
        ) : (
          <View style={styles.gridWrap}>
            {filtered.map((item) => (
              <View key={item.id} style={styles.gridCell}>
                <TableTile
                  table={item}
                  selected={selectedId === item.id}
                  onPress={() => {
                    if (item.status === TableStatus.OCCUPIED) {
                      Alert.alert('Bàn có khách', `Bàn ${item.code} đang phục vụ`);
                      return;
                    }
                    if (item.status === TableStatus.MAINTENANCE) {
                      Alert.alert('Bảo trì', `Bàn ${item.code} đang bảo trì`);
                      return;
                    }
                    setSelectedId(item.id);
                  }}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {selected ? (
          <Text style={styles.selectedLabel}>
            Đã chọn:{' '}
            <Text style={styles.selectedCode}>Bàn {selected.code.replace('B', '')}</Text>
          </Text>
        ) : (
          <Text style={styles.selectedHint}>Chọn bàn trống để tiếp tục</Text>
        )}
        <Button title="Chọn món" disabled={!selectedId} onPress={handleContinue} />
      </View>
    </View>
  );
}

function Legend() {
  return (
    <View style={styles.legend}>
      <LegendItem color={colors.tableEmpty} label="Trống" />
      <LegendItem color={colors.primary} label="Có khách" />
      <LegendItem color={colors.tableSelected} label="Đang chọn" />
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function TableTile({
  table,
  selected,
  onPress,
}: {
  table: TableDto;
  selected: boolean;
  onPress: () => void;
}) {
  const style = tableStyles(table.status, selected);
  const minutes = occupiedMinutes(table);

  return (
    <Pressable
      style={[
        styles.tableTile,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
          borderWidth: selected || table.status === TableStatus.OCCUPIED ? 2 : 0,
          borderStyle: table.status === TableStatus.MAINTENANCE ? 'dashed' : 'solid',
        },
      ]}
      onPress={onPress}
    >
      {table.status === TableStatus.MAINTENANCE ? (
        <Ionicons name="build-outline" size={22} color={style.icon} />
      ) : (
        <Ionicons name="restaurant-outline" size={24} color={style.icon} />
      )}
      <Text style={[styles.tableCode, { color: style.text }]}>{table.code}</Text>
      {minutes !== null ? (
        <View style={styles.timerBadge}>
          <Ionicons name="time-outline" size={10} color={colors.white} />
          <Text style={styles.timerText}>{minutes}p</Text>
        </View>
      ) : (
        <Text style={[styles.tableMeta, { color: style.text }]}>
          {TABLE_STATUS_LABELS[table.status]}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  skeletonWrap: { padding: spacing.base },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: colors.textSecondary },
  floorPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  floorPickerText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  floorTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  floorTabWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  floorTabActive: {
    backgroundColor: colors.primaryLight,
  },
  floorTabText: { fontSize: 13, color: colors.textSecondary },
  floorTabTextActive: { color: colors.primary, fontWeight: '600' },
  gridList: { flex: 1 },
  gridContent: { paddingHorizontal: spacing.base, paddingBottom: spacing.xl, flexGrow: 1 },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCell: {
    width: '31%',
    minWidth: 96,
  },
  tableTile: {
    width: '100%',
    aspectRatio: 0.95,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  tableCode: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  tableMeta: { fontSize: 10, marginTop: 2 },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  timerText: { fontSize: 10, color: colors.white, fontWeight: '600' },
  footer: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  selectedLabel: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  selectedCode: { color: colors.tableSelected, fontWeight: '700' },
  selectedHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
});
