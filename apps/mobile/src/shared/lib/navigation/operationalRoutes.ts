import type { Href } from 'expo-router';
import { StaffRole, STAFF_ROLE_TO_MOBILE_ROLE } from '@caffeapp/shared';
import { useSessionStore } from '@shared/stores/session';

export type OperationalGroup = '(station)' | '(cashier)';

export function isStationSession(): boolean {
  return useSessionStore.getState().isStationDevice;
}

export function operationalGroup(): OperationalGroup {
  return isStationSession() ? '(station)' : '(cashier)';
}

export function opFrontTab(tab: 'home' | 'orders' | 'tables' | 'settings'): Href {
  if (isStationSession()) {
    return `/(station)/(tabs)/front/${tab}` as Href;
  }
  return `/(cashier)/(tabs)/${tab}` as Href;
}

/** Stack screen under station or cashier group, e.g. `/menu`, `/order/${id}`. */
export function opStack(path: string): Href {
  const group = operationalGroup();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `/${group}${normalized}` as Href;
}

export function opKitchenOrder(orderId: string): Href {
  if (isStationSession()) {
    return `/(station)/kitchen/order/${orderId}` as Href;
  }
  return `/(barista)/order/${orderId}` as Href;
}

export function routeHrefAfterSession(): Href {
  if (isStationSession()) {
    return '/(station)/(tabs)/front/home';
  }

  const staffRole = useSessionStore.getState().staffRole;
  if (!staffRole) {
    return '/(auth)/login';
  }

  const mobileRole = STAFF_ROLE_TO_MOBILE_ROLE[staffRole];
  switch (mobileRole) {
    case 'cashier':
      return '/(cashier)/(tabs)/home';
    case 'barista':
      return '/(barista)/(tabs)/queue';
    case 'manager':
      return '/(manager)/dashboard';
  }
}
