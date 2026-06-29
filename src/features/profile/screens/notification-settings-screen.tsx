import { AppButton, AppText, Card, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, View } from 'react-native';
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../api/notification-permissions';
import {
  getOrCreateNotificationSettings,
  updateNotificationSettings,
} from '../api/notification-settings';
import { registerPushToken } from '../api/push-tokens';
import { ProfileSubpageHeader } from '../components/profile-subpage-header';
import type {
  NotificationPermission,
  NotificationSettings,
} from '../utils/notification-settings';

const notificationOptions = [
  {
    id: 'createdPollClosed',
    icon: 'flag-outline',
    title: '내 투표 마감',
    description: '내가 만든 투표가 마감되면 알려줘요',
  },
  {
    id: 'votedPollResult',
    icon: 'stats-chart-outline',
    title: '참여한 투표 결과',
    description: '참여한 투표가 마감되면 결과를 알려줘요',
  },
  {
    id: 'comments',
    icon: 'chatbubble-ellipses-outline',
    title: '댓글 알림',
    description: '내 투표에 새 댓글이 달리면 알려줘요',
  },
] as const;

type NotificationOptionId = (typeof notificationOptions)[number]['id'];

type NotificationState = Record<NotificationOptionId, boolean>;

const initialNotificationState: NotificationState = {
  comments: true,
  createdPollClosed: true,
  votedPollResult: true,
};

const initialPermission: NotificationPermission = {
  canAskAgain: true,
  status: 'undetermined',
};

const mapSettingsToState = (
  settings: NotificationSettings
): NotificationState => {
  return {
    comments: settings.commentEnabled,
    createdPollClosed: settings.createdPollClosedEnabled,
    votedPollResult: settings.votedPollResultEnabled,
  };
};

const getNotificationSettingUpdate = (
  optionId: NotificationOptionId,
  isEnabled: boolean
): Partial<NotificationSettings> => {
  if (optionId === 'createdPollClosed') {
    return { createdPollClosedEnabled: isEnabled };
  }

  if (optionId === 'votedPollResult') {
    return { votedPollResultEnabled: isEnabled };
  }

  return { commentEnabled: isEnabled };
};

export const NotificationSettingsScreen = () => {
  const { appTheme } = useThemeMode();
  const [enabledOptions, setEnabledOptions] = useState<NotificationState>(
    initialNotificationState
  );
  const [permission, setPermission] =
    useState<NotificationPermission>(initialPermission);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const isPermissionGranted = permission.status === 'granted';
  const isPermissionDenied = permission.status === 'denied';
  const permissionTitle = isPermissionGranted
    ? '알림 권한이 켜져 있어요'
    : '알림 권한이 필요해요';
  const permissionDescription = isPermissionGranted
    ? '선택한 투표 알림을 받을 수 있어요'
    : isPermissionDenied
      ? '기기 설정에서 Pickly 알림을 허용해주세요'
      : '투표 마감과 결과 알림을 받으려면 권한을 허용해주세요';

  const savePushToken = async () => {
    try {
      await registerPushToken();
    } catch {
      Alert.alert('알림 설정 실패', '기기 정보를 저장하지 못했어요');
    }
  };

  useEffect(() => {
    const loadNotificationSettings = async () => {
      try {
        const [settings, nextPermission] = await Promise.all([
          getOrCreateNotificationSettings(),
          getNotificationPermission(),
        ]);
        setEnabledOptions(mapSettingsToState(settings));
        setPermission(nextPermission);

        if (nextPermission.status === 'granted') {
          void savePushToken();
        }
      } catch {
        setEnabledOptions(initialNotificationState);
        setPermission(initialPermission);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    void loadNotificationSettings();
  }, []);

  const toggleOption = async (optionId: NotificationOptionId) => {
    const nextOptions = {
      ...enabledOptions,
      [optionId]: !enabledOptions[optionId],
    };

    setEnabledOptions(nextOptions);

    try {
      const nextSettings = await updateNotificationSettings(
        getNotificationSettingUpdate(optionId, nextOptions[optionId])
      );
      setEnabledOptions(mapSettingsToState(nextSettings));
    } catch {
      setEnabledOptions(enabledOptions);
      Alert.alert('알림 설정 실패', '알림 설정을 변경하지 못했어요');
    }
  };

  const handlePressPermission = async () => {
    if (isRequestingPermission) return;

    if (isPermissionDenied && !permission.canAskAgain) {
      await Linking.openSettings();
      return;
    }

    setIsRequestingPermission(true);

    try {
      const nextPermission = await requestNotificationPermission();
      setPermission(nextPermission);

      if (nextPermission.status === 'granted') {
        await savePushToken();
      }
    } catch {
      Alert.alert('권한 요청 실패', '알림 권한을 요청하지 못했어요');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <ProfileSubpageHeader title="투표 알림" />

      <Card style={styles.permissionCard}>
        <View
          style={[
            styles.permissionIcon,
            {
              backgroundColor: isPermissionGranted
                ? appTheme.colors.primarySoft
                : appTheme.colors.surfaceMuted,
            },
          ]}
        >
          <Ionicons
            color={
              isPermissionGranted
                ? appTheme.colors.primaryStrong
                : appTheme.colors.textMuted
            }
            name={
              isPermissionGranted ? 'notifications' : 'notifications-outline'
            }
            size={22}
          />
        </View>

        <View style={styles.permissionCopy}>
          <AppText variant="bodySmall" weight="bold">
            {permissionTitle}
          </AppText>
          <AppText tone="muted" variant="caption">
            {permissionDescription}
          </AppText>
        </View>

        {!isPermissionGranted ? (
          <AppButton
            loading={isRequestingPermission}
            size="sm"
            variant="outline"
            onPress={handlePressPermission}
          >
            {isPermissionDenied && !permission.canAskAgain
              ? '설정 열기'
              : '허용하기'}
          </AppButton>
        ) : null}
      </Card>

      <Card style={styles.card}>
        {isLoadingSettings ? (
          <LoadingState
            style={styles.loading}
            title="알림 설정을 불러오는 중이에요"
          />
        ) : (
          notificationOptions.map((option, index) => {
            const isEnabled = enabledOptions[option.id];

            return (
              <Pressable
                key={option.id}
                accessibilityRole="switch"
                accessibilityState={{
                  checked: isEnabled,
                  disabled: !isPermissionGranted,
                }}
                disabled={!isPermissionGranted}
                onPress={() => {
                  void toggleOption(option.id);
                }}
                style={[
                  styles.row,
                  !isPermissionGranted && styles.rowDisabled,
                  index > 0 && {
                    borderTopColor: appTheme.colors.border,
                    borderTopWidth: 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: appTheme.colors.surfaceMuted },
                  ]}
                >
                  <Ionicons
                    color={appTheme.colors.textMuted}
                    name={option.icon}
                    size={19}
                  />
                </View>

                <View style={styles.copy}>
                  <AppText variant="bodySmall" weight="bold">
                    {option.title}
                  </AppText>
                  <AppText tone="muted" variant="caption">
                    {option.description}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: isEnabled
                        ? appTheme.colors.primaryStrong
                        : appTheme.colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      {
                        backgroundColor: appTheme.colors.surface,
                        transform: [{ translateX: isEnabled ? 18 : 0 }],
                      },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })
        )}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    paddingVertical: theme.spacing.xs,
  },
  permissionCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  permissionIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  permissionCopy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    minHeight: 72,
    paddingVertical: theme.spacing.sm,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  icon: {
    alignItems: 'center',
    borderRadius: theme.radius.full,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  copy: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  loading: {
    paddingVertical: theme.spacing.xl,
  },
  toggle: {
    borderRadius: theme.radius.full,
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 3,
    width: 52,
  },
  toggleThumb: {
    borderRadius: theme.radius.full,
    height: 22,
    width: 22,
  },
});
