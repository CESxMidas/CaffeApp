import { isAxiosError } from 'axios';

export function getErrorMessage(error: unknown, fallback = 'Đã có lỗi xảy ra'): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join('\n');
    }
    if (typeof message === 'string') {
      return message;
    }
  }
  return fallback;
}
