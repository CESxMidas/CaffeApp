import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@caffeapp/shared';
import { NotificationHeaderButton } from '@features/notifications';
import { HeaderBackButton } from '@shared/components/HeaderBackButton';
import { RoleGuard } from '@shared/components/RoleGuard';

const backHeader = {
  headerShown: true as const,
  headerLeft: () => <HeaderBackButton />,
};

export default function ManagerLayout() {
  return (
    <RoleGuard allowed={['manager']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          headerStyle: { backgroundColor: colors.surface },
          headerRight: () => <NotificationHeaderButton href="/(manager)/notifications" />,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Tổng quan',
            headerTitle: 'QUẢN LÝ',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="menu-management"
          options={{
            title: 'Menu',
            headerTitle: 'Quản lý menu',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="owner-tools"
          options={{
            href: null,
            title: 'Quản trị chủ quán',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="staff"
          options={{
            href: null,
            title: 'Gán chi nhánh',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="staff/[id]"
          options={{
            href: null,
            title: 'Chi tiết nhân viên',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="tables"
          options={{
            href: null,
            title: 'Quản lý bàn',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="branch-approvals"
          options={{
            href: null,
            title: 'Duyệt gán chi nhánh',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            title: 'Thông báo',
            ...backHeader,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Cài đặt',
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </RoleGuard>
  );
}
