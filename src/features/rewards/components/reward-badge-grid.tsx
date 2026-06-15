import { AppText, EmptyInfoRow, LoadingState } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { RewardBadge } from '../utils/reward-badge';

type RewardBadgeGridProps = {
  badges: RewardBadge[];
  isLoading: boolean;
};

export const RewardBadgeGrid = ({
  badges,
  isLoading,
}: RewardBadgeGridProps) => {
  const { appTheme } = useThemeMode();
  const hasBadges = badges.length > 0;

  return (
    <View style={styles.section}>
      <AppText variant="bodySmall" weight="bold">
        획득 가능한 배지
      </AppText>

      {isLoading ? (
        <LoadingState
          style={styles.feedback}
          title="배지 목록을 불러오는 중이에요"
        />
      ) : hasBadges ? (
        <View style={styles.grid}>
          {badges.map((badge) => (
            <View
              key={badge.id}
              style={[
                styles.item,
                {
                  backgroundColor: appTheme.colors.surfaceMuted,
                  borderColor: appTheme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.icon,
                  { backgroundColor: appTheme.colors.secondarySoft },
                ]}
              >
                <Ionicons
                  color={appTheme.colors.secondary}
                  name={badge.icon}
                  size={24}
                />
              </View>
              <AppText align="center" variant="bodySmall" weight="bold">
                {badge.label}
              </AppText>
            </View>
          ))}
        </View>
      ) : (
        <EmptyInfoRow
          description="잠시 후 다시 시도해주세요"
          icon={
            <Ionicons
              color={appTheme.colors.textSubtle}
              name="ribbon-outline"
              size={18}
            />
          }
          iconBackgroundColor={appTheme.colors.surfaceMuted}
          title="등록된 배지가 없어요"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  item: {
    alignItems: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    minHeight: 98,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    width: '30.5%',
  },
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  feedback: {
    paddingVertical: theme.spacing.lg,
  },
});
