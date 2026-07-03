import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@caffeapp/shared';
import { Card } from '@shared/components/ui';
import { usePendingBranchAssignments } from '@features/staff';
import { useIsOwner } from '@shared/hooks/usePermission';

const OWNER_ACTIONS = [
  {
    icon: 'checkmark-done-outline' as const,
    title: 'Duyệt gán chi nhánh',
    desc: 'Phê duyệt đề xuất gán CN từ quản lý — nhân viên không tự chọn',
    route: '/(manager)/branch-approvals' as const,
    badgeKey: 'pending' as const,
  },
  {
    icon: 'people-outline' as const,
    title: 'Gán chi nhánh nhân viên',
    desc: 'Đề xuất gán CN (chủ quán có thể chọn mọi chi nhánh)',
    route: '/(manager)/staff' as const,
  },
  {
    icon: 'git-branch-outline' as const,
    title: 'Quản lý chi nhánh',
    desc: 'Tạo, sửa, xóa chi nhánh trong chuỗi',
    route: '/(manager)/branches' as const,
  },
  {
    icon: 'person-add-outline' as const,
    title: 'Tạo tài khoản',
    desc: 'Thêm user mới và gán vai trò nhân viên',
    route: '/(manager)/create-user' as const,
  },
  {
    icon: 'document-text-outline' as const,
    title: 'Audit log',
    desc: 'Lịch sử thao tác theo chi nhánh',
    status: 'Post-MVP',
  },
];

export default function OwnerToolsScreen() {
  const isOwner = useIsOwner();
  const { data: pending } = usePendingBranchAssignments(isOwner);
  const pendingCount = pending?.length ?? 0;

  useEffect(() => {
    if (!isOwner) {
      router.replace('/(manager)/dashboard');
    }
  }, [isOwner]);

  if (!isOwner) {
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Khu vực chủ quán. Gán chi nhánh do quản lý đề xuất — bạn duyệt trước khi nhân viên đăng
        nhập.
      </Text>

      <View style={styles.list}>
        {OWNER_ACTIONS.map((item) => {
          const isNavigable = 'route' in item && item.route;
          const showBadge = item.badgeKey === 'pending' && pendingCount > 0;

          const content = (
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={24} color={colors.primary} />
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    {showBadge ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{pendingCount}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.desc}>{item.desc}</Text>
                  {'status' in item && item.status ? (
                    <Text style={styles.status}>{item.status}</Text>
                  ) : null}
                </View>
                {isNavigable ? (
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                ) : null}
              </View>
            </Card>
          );

          if (isNavigable) {
            return (
              <Pressable key={item.title} onPress={() => router.push(item.route)}>
                {content}
              </Pressable>
            );
          }

          return <View key={item.title}>{content}</View>;
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.base },
  intro: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.base },
  list: { gap: spacing.sm },
  card: {},
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  desc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  status: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
});
