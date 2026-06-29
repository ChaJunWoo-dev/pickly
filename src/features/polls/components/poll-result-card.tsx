import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';
import type { PollOptionPreview } from './poll-card';

type PollResultCardProps = {
  options: PollOptionPreview[];
  participantCount: number;
};

export const PollResultCard = ({
  options,
  participantCount,
}: PollResultCardProps) => {
  return (
    <Card style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <AppText variant="bodySmall" weight="bold">
          투표 결과
        </AppText>
        <AppText tone="muted" variant="caption" weight="semibold">
          총 {participantCount.toLocaleString()}표
        </AppText>
      </View>

      <View style={styles.resultList}>
        {options.map((option, index) => (
          <View key={option.id} style={styles.resultItem}>
            <View style={styles.resultLabelRow}>
              <AppText variant="caption" weight="semibold">
                {option.label}
              </AppText>
              <AppText variant="caption" weight="bold">
                {option.percent}%
              </AppText>
            </View>
            <View style={styles.resultTrack}>
              <View
                style={[
                  styles.resultFill,
                  {
                    backgroundColor:
                      index === 0
                        ? theme.colors.primaryStrong
                        : theme.colors.borderStrong,
                    width: `${option.percent}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    gap: theme.spacing.lg,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultList: {
    gap: theme.spacing.md,
  },
  resultItem: {
    gap: theme.spacing.xs,
  },
  resultLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultTrack: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.full,
    height: 6,
    overflow: 'hidden',
  },
  resultFill: {
    borderRadius: theme.radius.full,
    height: '100%',
  },
});
