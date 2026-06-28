import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@caffeapp/shared';
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
          name="branch-approvals"
          options={{
            href: null,
            title: 'Duyệt gán chi nhánh',
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
