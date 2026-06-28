import { StyleSheet, View } from 'react-native';
import { colors } from '@caffeapp/shared';
import { EmptyState } from '@shared/components/ui';

export default function CashierOrdersScreen() {
  return (
    <View style={styles.container}>
      <EmptyState
        icon="receipt-outline"
        title="Chưa có đơn đang phục vụ"
        subtitle="Đơn mới sẽ hiện ở đây sau khi tạo"
        actionLabel="Tạo đơn mới"
        onAction={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
