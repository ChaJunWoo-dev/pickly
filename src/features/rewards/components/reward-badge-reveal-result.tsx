import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { RewardBadge } from '../utils/reward-badge';

type RewardBadgeRevealResultProps = {
  badge: RewardBadge | null;
  isRolling: boolean;
};

export const RewardBadgeRevealResult = ({
  badge,
  isRolling,
}: RewardBadgeRevealResultProps) => {
  const { appTheme } = useThemeMode();

  if (isRolling) {
    return (
      <View style={styles.result}>
        <View
          style={[
            styles.rollingIcon,
            { backgroundColor: appTheme.colors.secondarySoft },
          ]}
        >
          <Ionicons
            color={appTheme.colors.secondary}
            name={badge?.icon ?? 'sparkles'}
            size={46}
          />
        </View>
        <View style={styles.copy}>
          <AppText align="center" variant="bodySmall" weight="bold">
            배지를 고르는 중이에요
          </AppText>
          <AppText align="center" tone="muted" variant="caption">
            {badge?.label ?? '어떤 배지가 나올까요?'}
          </AppText>
        </View>
      </View>
    );
  }

  if (!badge) {
    return null;
  }

  return (
    <View style={styles.result}>
      <AppText align="center" variant="bodySmall" weight="bold">
        새 배지를 획득했어요
      </AppText>
      <View
        style={[
          styles.revealedIcon,
          { backgroundColor: appTheme.colors.secondarySoft },
        ]}
      >
        <Ionicons color={appTheme.colors.secondary} name={badge.icon} size={50} />
      </View>
      <AppText align="center" variant="subtitle" weight="bold">
        {badge.label}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {
    alignItems: 'center',
    gap: theme.spacing.md,
    minHeight: 180,
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  rollingIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
  copy: {
    gap: theme.spacing.xxs,
  },
  revealedIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
});
