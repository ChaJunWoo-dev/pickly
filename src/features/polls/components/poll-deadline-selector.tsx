import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Pressable, StyleSheet, View } from 'react-native';

const deadlineOptions = [
  { id: '1h', label: '1시간' },
  { id: '6h', label: '6시간' },
  { id: '12h', label: '12시간' },
  { id: '24h', label: '24시간' },
  { id: '1d', label: '1일' },
];

const selectedDeadlineId = '24h';

export const PollDeadlineSelector = () => {
  return (
    <View style={styles.field}>
      <AppText variant="body" weight="semibold">
        투표 마감 시간
      </AppText>

      <View style={styles.deadlineGrid}>
        {deadlineOptions.map((option) => {
          const isSelected = option.id === selectedDeadlineId;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              style={[
                styles.deadlineOption,
                isSelected && styles.deadlineOptionSelected,
              ]}
            >
              <AppText
                tone={isSelected ? 'primary' : 'muted'}
                variant="bodySmall"
                weight="semibold"
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.md,
  },
  deadlineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  deadlineOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: theme.spacing.lg,
  },
  deadlineOptionSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryStrong,
  },
});
