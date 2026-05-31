import { AppInput, AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export type PollOptionInput = {
  id: string;
  text: string;
};

type PollOptionFieldsProps = {
  options: PollOptionInput[];
  optionMaxLength: number;
  maxOptionCount: number;
  onAddOption: () => void;
  onChangeOptionText: (optionId: string, text: string) => void;
  onRemoveOption: (optionId: string) => void;
};

export const PollOptionFields = ({
  options,
  optionMaxLength,
  maxOptionCount,
  onAddOption,
  onChangeOptionText,
  onRemoveOption,
}: PollOptionFieldsProps) => {
  const canAddOption = options.length < maxOptionCount;

  return (
    <View style={styles.field}>
      <AppText variant="body" weight="semibold">
        선택지 (2-4개)
      </AppText>

      <View style={styles.optionList}>
        {options.map((option, index) => (
          <View key={option.id} style={styles.optionRow}>
            <View style={styles.optionInputWrap}>
              <AppInput
                placeholder={`선택지 ${index + 1}`}
                style={styles.optionInput}
                maxLength={optionMaxLength}
                value={option.text}
                onChangeText={(text) => onChangeOptionText(option.id, text)}
                rightElement={
                  <AppText tone="subtle" variant="caption">
                    {option.text.length}/{optionMaxLength}
                  </AppText>
                }
              />
            </View>

            {index >= 2 && (
              <Pressable
                accessibilityRole="button"
                onPress={() => onRemoveOption(option.id)}
                style={styles.optionRemoveButton}
              >
                <Ionicons
                  color={theme.colors.textMuted}
                  name="close"
                  size={22}
                />
              </Pressable>
            )}
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          disabled={!canAddOption}
          onPress={onAddOption}
          style={[
            styles.addOptionButton,
            !canAddOption && styles.disabledAddOptionButton,
          ]}
        >
          <Ionicons color={theme.colors.textMuted} name="add" size={20} />
          <AppText tone="muted" variant="bodySmall" weight="semibold">
            {canAddOption ? '옵션 추가' : '최대 4개까지'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.md,
  },
  optionList: {
    gap: theme.spacing.sm,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  optionInputWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionInput: {
    height: 50,
  },
  optionRemoveButton: {
    alignItems: 'center',
    flexShrink: 0,
    height: 44,
    justifyContent: 'center',
    width: 32,
  },
  addOptionButton: {
    alignItems: 'center',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.sm,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  disabledAddOptionButton: {
    opacity: 0.45,
  },
});
