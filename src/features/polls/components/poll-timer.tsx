import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type PollTimerProps = {
  timeLeft: string;
  timeLeftSeconds: number;
};

export const PollTimer = ({ timeLeft, timeLeftSeconds }: PollTimerProps) => {
  const isClosingSoon = timeLeftSeconds <= 24 * 60 * 60;
  const timerColor = isClosingSoon
    ? theme.colors.danger
    : theme.colors.textMuted;

  return (
    <View style={styles.timer}>
      <Ionicons color={timerColor} name="time-outline" size={14} />
      <AppText style={{ color: timerColor }} variant="caption" weight="semibold">
        {timeLeft} 남음
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  timer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xxs,
  },
});
