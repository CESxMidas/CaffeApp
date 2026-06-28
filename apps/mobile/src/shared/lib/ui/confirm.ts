import { Alert, Platform } from 'react-native';
import { showToast } from '@shared/components/ui/Toast';

/** Cross-platform confirm — Alert.alert is a no-op on React Native Web. */
export function confirmAction(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Huỷ', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Xác nhận', onPress: () => resolve(true) },
    ]);
  });
}

export function showMessage(
  title: string,
  message: string,
  variant: 'success' | 'error' | 'warning' | 'info' = 'info',
): void {
  if (Platform.OS === 'web') {
    showToast({ title, message, variant });
    return;
  }
  showToast({ title, message, variant });
}
