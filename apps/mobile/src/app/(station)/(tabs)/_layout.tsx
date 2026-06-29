import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@caffeapp/shared';

export default function StationTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.surface },
        tabBarStyle: { backgroundColor: colors.surface, height: 60, paddingBottom: 6 },
      }}
    >
      <Tabs.Screen
        name="front"
        options={{
          title: 'Thu ngân',
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kitchen"
        options={{
          title: 'Bếp',
          headerTitle: 'Hàng đợi bếp',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="cafe-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
