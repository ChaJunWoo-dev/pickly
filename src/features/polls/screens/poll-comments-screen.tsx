import {
  AppButton,
  AppInput,
  AppText,
  Avatar,
  Card,
  EmptyInfoRow,
  Screen,
} from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const COMMENT_MAX_LENGTH = 200;

const sampleComments = [
  {
    id: 'comment-1',
    body: '저는 첫 번째 선택지가 더 끌려요',
    createdAtLabel: '방금 전',
  },
  {
    id: 'comment-2',
    body: '생각보다 고민되네요. 결과도 궁금해요',
    createdAtLabel: '3분 전',
  },
  {
    id: 'comment-3',
    body: '다른 사람들 의견 보는 재미가 있어요',
    createdAtLabel: '12분 전',
  },
];

export const PollCommentsScreen = () => {
  const router = useRouter();
  const { appTheme } = useThemeMode();
  const [comment, setComment] = useState('');

  const isEmpty = sampleComments.length === 0;
  const trimmedComment = comment.trim();
  const canSubmit = trimmedComment.length > 0;

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
          <Ionicons
            color={appTheme.colors.text}
            name="chevron-back"
            size={22}
          />
        </Pressable>

        <AppText style={styles.topBarTitle} variant="subtitle" weight="bold">
          참여자 한마디
        </AppText>

        <View style={styles.iconButton} />
      </View>

      <View style={styles.summary}>
        <AppText variant="bodySmall" weight="semibold">
          전체 댓글 {sampleComments.length}개
        </AppText>
        <AppText tone="muted" variant="caption">
          투표에 대한 생각을 자유롭게 나눠보세요
        </AppText>
      </View>

      <Card style={styles.composerCard}>
        <View style={styles.composerHeader}>
          <AppText variant="bodySmall" weight="bold">
            댓글 작성
          </AppText>

          <AppText
            tone={comment.length >= COMMENT_MAX_LENGTH ? 'danger' : 'muted'}
            variant="caption"
            weight="semibold"
          >
            {comment.length}/{COMMENT_MAX_LENGTH}
          </AppText>
        </View>

        <AppInput
          maxLength={COMMENT_MAX_LENGTH}
          multiline
          onChangeText={setComment}
          placeholder="예) 저는 첫 번째 선택지가 더 끌려요"
          style={styles.commentInput}
          value={comment}
        />

        <View style={styles.composerFooter}>
          <AppText tone="subtle" variant="caption">
            댓글은 작성 후 다른 참여자에게 공개돼요
          </AppText>

          <AppButton disabled={!canSubmit} size="sm">
            등록
          </AppButton>
        </View>
      </Card>

      <Card style={styles.commentListCard}>
        {isEmpty ? (
          <EmptyInfoRow
            description="첫 댓글을 남겨보세요"
            icon={
              <Ionicons
                color={appTheme.colors.textSubtle}
                name="chatbubble-ellipses-outline"
                size={18}
              />
            }
            iconBackgroundColor={appTheme.colors.surfaceMuted}
            title="아직 한마디가 없어요"
          />
        ) : (
          <View style={styles.commentList}>
            {sampleComments.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.commentRow,
                  index > 0 && { borderTopColor: appTheme.colors.border },
                  index > 0 && styles.commentRowBorder,
                ]}
              >
                <Avatar name="익명" size="sm" />

                <View style={styles.commentBody}>
                  <View style={styles.commentMeta}>
                    <AppText variant="caption" weight="bold">
                      익명
                    </AppText>
                    <AppText tone="subtle" variant="caption">
                      {item.createdAtLabel}
                    </AppText>
                  </View>

                  <AppText tone="muted" variant="bodySmall">
                    {item.body}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
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
    zIndex: 1,
  },
  summary: {
    gap: theme.spacing.xs,
  },
  commentListCard: {
    gap: theme.spacing.md,
  },
  commentList: {
    gap: 0,
  },
  commentRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  commentRowBorder: {
    borderTopWidth: 1,
  },
  commentBody: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  commentMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  composerCard: {
    gap: theme.spacing.md,
  },
  composerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  composerFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
