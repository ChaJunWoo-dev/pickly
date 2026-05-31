import { AppInput, AppText } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export const PollOptionFields = () => {
  const OPTION_MAX_LENGTH = 20;
  const [options, setOptions] = useState([
    { id: 'option-1', text: '', placeholder: '선택지 1' },
    { id: 'option-2', text: '', placeholder: '선택지 2' },
  ]);

  const handleChangeOptionText = (optionId: string, text: string) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === optionId ? { ...option, text } : option
      )
    );
  };

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
                placeholder={option.placeholder}
                style={styles.optionInput}
                maxLength={OPTION_MAX_LENGTH}
                value={option.text}
                onChangeText={(text) => handleChangeOptionText(option.id, text)}
                rightElement={
                  <AppText tone="subtle" variant="caption">
                    {option.text.length}/{OPTION_MAX_LENGTH}
                  </AppText>
                }
              />
            </View>

            {index > 2 && (
              <Pressable
                accessibilityRole="button"
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

        <Pressable accessibilityRole="button" style={styles.addOptionButton}>
          <Ionicons color={theme.colors.textMuted} name="add" size={20} />
          <AppText tone="muted" variant="bodySmall" weight="semibold">
            옵션 추가
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
  optionCount: {},
});
