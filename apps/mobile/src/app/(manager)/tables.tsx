import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TableStatus, TABLE_STATUS_LABELS, colors, spacing, borderRadius } from '@caffeapp/shared';
import type { TableDto } from '@caffeapp/shared';
import { useTables, useUpdateTableStatus } from '@features/orders';
import { Card, EmptyState, ErrorScreen } from '@shared/components/ui';
import { usePermission } from '@shared/hooks/usePermission';
import { showMessage } from '@shared/lib/ui/confirm';
import { getErrorMessage } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

function tableTone(status: TableStatus) {
  if (status === TableStatus.MAINTENANCE) {
    return {
      background: colors.accentLight,
      border: colors.accent,
      icon: colors.accent,
      text: colors.text,
    };
  }

  if (status === TableStatus.OCCUPIED) {
    return {
      background: colors.primaryLight,
      border: colors.primary,
      icon: colors.primaryDark,
      text: colors.text,
    };
  }

  return {
    background: colors.surface,
    border: colors.border,
    icon: colors.textMuted,
    text: colors.text,
  };
}

function groupByFloor(tables: TableDto[]) {
  const grouped = new Map<string, TableDto[]>();
  for (const table of tables) {
    const floor = table.floor ?? 'Tầng 1';
    grouped.set(floor, [...(grouped.get(floor) ?? []), table]);
  }
  return Array.from(grouped.entries());
}

export default function ManagerTablesScreen() {
  const canManage = usePermission('tables:manage');
  const activeBranchId = useSessionStore((s) => s.activeBranchId);
  const { data: tables, isPending, isError, refetch } = useTables(activeBranchId);
  const updateStatus = useUpdateTableStatus();
  const [updatingTableId, setUpdatingTableId] = useState<string | null>(null);

  useEffect(() => {
    if (!canManage) {
      router.replace('/(manager)/dashboard');
    }
  }, [canManage]);

  const groupedTables = useMemo(() => groupByFloor(tables ?? []), [tables]);

  const handleMaintenanceToggle = (table: TableDto, value: boolean) => {
    const status = value ? TableStatus.MAINTENANCE : TableStatus.EMPTY;
    setUpdatingTableId(table.id);
    updateStatus.mutate(
      { tableId: table.id, status },
      {
        onSuccess: () => {
          showMessage(
            'Đã cập nhật',
            value ? `Bàn ${table.code} đang bảo trì` : `Bàn ${table.code} đã mở lại`,
            'success',
          );
        },
        onError: (err: unknown) => {
          showMessage('Lỗi', getErrorMessage(err, 'Không cập nhật được trạng thái bàn'), 'error');
        },
        onSettled: () => setUpdatingTableId(null),
      },
    );
  };

  if (!canManage) return null;

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !tables) {
    return (
      <View style={styles.container}>
        <ErrorScreen message="Không tải được sơ đồ bàn" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryTitle}>Quản lý bàn</Text>
            <Text style={styles.summaryMeta}>
              {tables.length} bàn ·{' '}
              {tables.filter((table) => table.status === TableStatus.MAINTENANCE).length} bảo trì
            </Text>
          </View>
          <Ionicons name="construct-outline" size={24} color={colors.accent} />
        </View>
      </Card>

      {tables.length === 0 ? (
        <EmptyState
          icon="grid-outline"
          title="Chưa có bàn"
          subtitle="Danh sách bàn sẽ hiển thị sau khi seed dữ liệu chi nhánh"
        />
      ) : (
        groupedTables.map(([floor, floorTables]) => (
          <View key={floor} style={styles.floorSection}>
            <Text style={styles.floorTitle}>{floor}</Text>
            <View style={styles.tableGrid}>
              {floorTables.map((table) => (
                <TableMaintenanceTile
                  key={table.id}
                  table={table}
                  loading={updatingTableId === table.id}
                  disabled={updateStatus.isPending}
                  onToggle={handleMaintenanceToggle}
                />
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function TableMaintenanceTile({
  table,
  loading,
  disabled,
  onToggle,
}: {
  table: TableDto;
  loading: boolean;
  disabled: boolean;
  onToggle: (table: TableDto, value: boolean) => void;
}) {
  const tone = tableTone(table.status);
  const isMaintenance = table.status === TableStatus.MAINTENANCE;
  const isOccupied = table.status === TableStatus.OCCUPIED;

  return (
    <View
      style={[
        styles.tableTile,
        {
          backgroundColor: tone.background,
          borderColor: tone.border,
          borderStyle: isMaintenance ? 'dashed' : 'solid',
        },
      ]}
    >
      <View style={styles.tableHeader}>
        <Ionicons
          name={
            isMaintenance ? 'construct-outline' : isOccupied ? 'people-outline' : 'grid-outline'
          }
          size={22}
          color={tone.icon}
        />
        {loading ? <ActivityIndicator size="small" color={colors.accent} /> : null}
      </View>
      <Text style={[styles.tableCode, { color: tone.text }]}>{table.code}</Text>
      <Text style={styles.tableMeta}>
        {TABLE_STATUS_LABELS[table.status]} · {table.capacity} chỗ
      </Text>
      {isOccupied ? <Text style={styles.lockedText}>Có đơn đang phục vụ</Text> : null}
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Bảo trì</Text>
        <Switch
          value={isMaintenance}
          disabled={disabled || isOccupied}
          onValueChange={(value) => onToggle(table, value)}
          trackColor={{ false: colors.border, true: colors.accentLight }}
          thumbColor={isMaintenance ? colors.accent : colors.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryCard: { marginBottom: spacing.base },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  summaryMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  floorSection: { marginBottom: spacing.lg },
  floorTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  tableGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tableTile: {
    width: '31.5%',
    minWidth: 104,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tableCode: { fontSize: 16, fontWeight: '700', marginTop: spacing.xs },
  tableMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  lockedText: { fontSize: 10, color: colors.textMuted, marginTop: spacing.xs },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  switchLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
});
