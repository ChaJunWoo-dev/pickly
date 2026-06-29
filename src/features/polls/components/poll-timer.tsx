import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getPollTimeLeft } from '../utils/poll-deadline';

type PollTimerProps = {
  expiresAt: string;
};

export const PollTimer = ({ expiresAt }: PollTimerProps) => {
  const [now, setNow] = useState(() => Date.now());
  const { timeLeft, timeLeftSeconds } = getPollTimeLeft(expiresAt, now);

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const isClosed = timeLeftSeconds <= 0;
  const isClosingSoon = timeLeftSeconds <= 60 * 60;
  const timerColor = isClosed
    ? theme.colors.textMuted
    : isClosingSoon
      ? theme.colors.danger
      : theme.colors.textMuted;
  const timerLabel = isClosed ? '마감' : `${timeLeft} 남음`;

  return (
    <View style={styles.timer}>
      <Ionicons
        color={timerColor}
        name={isClosed ? 'lock-closed-outline' : 'time-outline'}
        size={14}
      />
      <AppText
        style={{ color: timerColor }}
        variant="caption"
        weight="semibold"
      >
        {timerLabel}
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
