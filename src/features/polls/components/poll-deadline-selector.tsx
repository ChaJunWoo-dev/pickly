import { AppText } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Pressable, StyleSheet, View } from 'react-native';
import { PollDeadlineId } from '../utils/poll-deadline';

const deadlineOptions = [
  { id: '1h', label: '1시간' },
  { id: '6h', label: '6시간' },
  { id: '12h', label: '12시간' },
  { id: '24h', label: '1일' },
] satisfies readonly {
  id: PollDeadlineId;
  label: string;
}[];

type PollDeadlineSelectorProps = {
  selectedDeadlineId: PollDeadlineId;
  onSelectDeadline: (deadlineId: PollDeadlineId) => void;
};

export const PollDeadlineSelector = ({
  selectedDeadlineId,
  onSelectDeadline,
}: PollDeadlineSelectorProps) => {
  const { appTheme } = useThemeMode();

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
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectDeadline(option.id)}
              style={[
                styles.deadlineOption,
                isSelected && {
                  backgroundColor: appTheme.colors.primary,
                  borderColor: appTheme.colors.primaryStrong,
                },
              ]}
            >
              <AppText
                style={isSelected && { color: appTheme.colors.inverseText }}
                tone="muted"
                variant="bodySmall"
                weight={isSelected ? 'bold' : 'semibold'}
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
});
