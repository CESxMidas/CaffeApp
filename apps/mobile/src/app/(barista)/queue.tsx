import { StyleSheet, View } from 'react-native';
import { colors } from '@caffeapp/shared';
import { EmptyState } from '@shared/components/ui';

export default function BaristaQueueScreen() {
  return (
    <View style={styles.container}>
      <EmptyState
        icon="cafe-outline"
        title="Không có đơn chờ"
        subtitle="Tất cả đơn đã được xử lý xong"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
});
