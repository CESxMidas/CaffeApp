import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ROLE_LABELS, StaffRole, colors, spacing, borderRadius } from '@caffeapp/shared';
import { Button } from '@shared/components/ui';
import { useBranchOperators } from '../hooks/useBranchOperators';

interface StaffPickerModalProps {
  visible: boolean;
  operatorRoles?: StaffRole[];
  onClose: () => void;
  onSelect: (staffId: string) => void;
}

export function StaffPickerModal({
  visible,
  operatorRoles,
  onClose,
  onSelect,
}: StaffPickerModalProps) {
  const { data: operators, isLoading, isError, refetch } = useBranchOperators(
    visible,
    operatorRoles,
  );

  const subtitle =
    operatorRoles?.length === 1 && operatorRoles[0] === StaffRole.BARISTA
      ? 'Chọn barista xác nhận thao tác bếp'
      : operatorRoles?.length === 1 && operatorRoles[0] === StaffRole.CASHIER
        ? 'Chọn nhân viên phục vụ xác nhận'
        : 'Thao tác trên tablet trạm cần ghi đúng tên NV';

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Chọn nhân viên xác nhận</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : isError ? (
            <View style={styles.errorBlock}>
              <Text style={styles.errorText}>Không tải được danh sách nhân viên</Text>
              <Button title="Thử lại" variant="outline" onPress={() => refetch()} />
            </View>
          ) : (
            <FlatList
              data={operators ?? []}
              keyExtractor={(item) => item.id}
              style={styles.list}
              renderItem={({ item }) => (
                <Pressable style={styles.row} onPress={() => onSelect(item.id)}>
                  <View>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.role}>{ROLE_LABELS[item.role] ?? item.role}</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>
                  {operatorRoles?.includes(StaffRole.BARISTA)
                    ? 'Không có barista active tại chi nhánh'
                    : 'Không có nhân viên active tại chi nhánh'}
                </Text>
              }
            />
          )}

          <Button title="Huỷ" variant="outline" onPress={onClose} style={styles.cancelBtn} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.base,
    maxHeight: '70%',
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  loader: { marginVertical: spacing.xl },
  list: { maxHeight: 320 },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  role: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  empty: { textAlign: 'center', color: colors.textMuted, paddingVertical: spacing.lg },
  errorBlock: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  errorText: { color: colors.error, textAlign: 'center' },
  cancelBtn: { marginTop: spacing.md },
});
