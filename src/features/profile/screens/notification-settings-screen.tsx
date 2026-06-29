import { Card, LoadingState, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { showErrorToast } from '@/lib/toast';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet } from 'react-native';
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../api/notification-permissions';
import {
  getOrCreateNotificationSettings,
  updateNotificationSettings,
} from '../api/notification-settings';
import { registerPushToken } from '../api/push-tokens';
import { NotificationOptionRow } from '../components/notification-option-row';
import { NotificationPermissionCard } from '../components/notification-permission-card';
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
  const [enabledOptions, setEnabledOptions] = useState<NotificationState>(
    initialNotificationState
  );
  const [permission, setPermission] =
    useState<NotificationPermission>(initialPermission);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const isPermissionGranted = permission.status === 'granted';
  const isPermissionDenied = permission.status === 'denied';

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
        showErrorToast('알림 설정을 불러오지 못했어요');
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

      <NotificationPermissionCard
        canAskAgain={permission.canAskAgain}
        isDenied={isPermissionDenied}
        isGranted={isPermissionGranted}
        isRequesting={isRequestingPermission}
        onPressPermission={handlePressPermission}
      />

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
              <NotificationOptionRow
                key={option.id}
                description={option.description}
                icon={option.icon}
                isDisabled={!isPermissionGranted}
                isEnabled={isEnabled}
                showBorder={index > 0}
                title={option.title}
                onPress={() => {
                  void toggleOption(option.id);
                }}
              />
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
  loading: {
    paddingVertical: theme.spacing.xl,
  },
});
