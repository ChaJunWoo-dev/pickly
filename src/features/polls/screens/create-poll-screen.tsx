import { AppButton, AppInput, AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PollCategorySelector } from '../components/poll-category-selector';
import { PollDeadlineSelector } from '../components/poll-deadline-selector';
import { PollOptionFields } from '../components/poll-option-fields';
import { PollRewardPreviewCard } from '../components/poll-reward-preview-card';
import type { PollCategoryId } from '../constants/config/poll-categories';

export const CreatePollScreen = () => {
  const QUESTION_MAX_LENGTH = 50;
  const [question, setQuestion] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<PollCategoryId | null>(null);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons color={theme.colors.text} name="chevron-back" size={22} />
        </Pressable>

        <AppText variant="subtitle" weight="bold" style={styles.topBarTitle}>
          투표 만들기
        </AppText>
      </View>

      <View style={styles.field}>
        <AppText variant="body" weight="semibold">
          질문을 입력하세요
        </AppText>
        <AppInput
          placeholder="예) 오늘 점심은 뭐 먹을까?"
          style={styles.inputField}
          value={question}
          maxLength={QUESTION_MAX_LENGTH}
          onChangeText={(text) => setQuestion(text)}
        />
        <AppText tone="muted" variant="caption" style={styles.characterCount}>
          {question.length}/50
        </AppText>
      </View>

      <PollCategorySelector
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <PollOptionFields />

      <PollDeadlineSelector />

      <PollRewardPreviewCard />

      <AppButton>투표 생성하기</AppButton>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxxl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  topBarTitle: {
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  field: {
    gap: theme.spacing.md,
  },
  inputField: {
    height: 50,
  },
  characterCount: {
    alignSelf: 'flex-end',
  },
});
