import { AppText, Card } from '@/components';
import { theme } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

type ProfileActivitySummaryProps = {
  currentPoints: number;
};

export const ProfileActivitySummary = ({
  currentPoints,
}: ProfileActivitySummaryProps) => {
  const stats = [
    { id: 'votes', label: '참여한 투표', value: '18' },
    { id: 'created', label: '만든 투표', value: '3' },
    {
      id: 'points',
      label: '보유 포인트',
      value: `${currentPoints.toLocaleString()}P`,
    },
  ];

  return (
    <Card style={styles.card}>
      {stats.map((stat, index) => (
        <View key={stat.id} style={styles.stat}>
          <AppText variant="subtitle" weight="bold">
            {stat.value}
          </AppText>
          <AppText tone="muted" variant="caption" weight="semibold">
            {stat.label}
          </AppText>
          {index < stats.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.xs,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 34,
    position: 'absolute',
    right: 0,
    top: 4,
    width: 1,
  },
});
