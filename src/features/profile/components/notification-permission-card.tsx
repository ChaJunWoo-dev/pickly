import { AppButton, AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type NotificationPermissionCardProps = {
  canAskAgain: boolean;
  isDenied: boolean;
  isGranted: boolean;
  isRequesting: boolean;
  onPressPermission: () => void;
};

export const NotificationPermissionCard = ({
  canAskAgain,
  isDenied,
  isGranted,
  isRequesting,
  onPressPermission,
}: NotificationPermissionCardProps) => {
  const { appTheme } = useThemeMode();
  const title = isGranted ? '알림 권한이 켜져 있어요' : '알림 권한이 필요해요';
  const description = isGranted
    ? '선택한 투표 알림을 받을 수 있어요'
    : isDenied
      ? '기기 설정에서 Pickly 알림을 허용해주세요'
      : '투표 마감과 결과 알림을 받으려면 권한을 허용해주세요';

  return (
    <Card style={styles.card}>
      <View
        style={[
          styles.icon,
          {
            backgroundColor: isGranted
              ? appTheme.colors.primarySoft
              : appTheme.colors.surfaceMuted,
          },
        ]}
      >
        <Ionicons
          color={
            isGranted
              ? appTheme.colors.primaryStrong
              : appTheme.colors.textMuted
          }
          name={isGranted ? 'notifications' : 'notifications-outline'}
          size={22}
        />
      </View>

      <View style={styles.copy}>
        <AppText variant="bodySmall" weight="bold">
          {title}
        </AppText>
        <AppText tone="muted" variant="caption">
          {description}
        </AppText>
      </View>

      {!isGranted ? (
        <AppButton
          loading={isRequesting}
          size="sm"
          variant="outline"
          onPress={onPressPermission}
        >
          {isDenied && !canAskAgain ? '설정 열기' : '허용하기'}
        </AppButton>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
});
