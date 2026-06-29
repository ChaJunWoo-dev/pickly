import { AppText, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { useThemeMode } from '@/contexts/theme-mode';
import { showErrorToast } from '@/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  createPollComment,
  getPollComments,
  getPollOwnerId,
  getUserCommentNotificationEnabled,
  sendCommentPushNotification,
} from '../api/poll-comments';
import { PollCommentComposer } from '../components/poll-comment-composer';
import { PollCommentList } from '../components/poll-comment-list';
import type { PollComment } from '../utils/poll-comments';

const COMMENT_MAX_LENGTH = 200;

export const PollCommentsScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { appTheme } = useThemeMode();
  const [commentBody, setCommentBody] = useState('');
  const [comments, setComments] = useState<PollComment[]>([]);
  const [pollOwnerId, setPollOwnerId] = useState<string | null>(null);
  const [pollOwnerCommentEnabled, setPollOwnerCommentEnabled] = useState(true);

  const trimmedComment = commentBody.trim();
  const canSubmit = trimmedComment.length > 0;

  const handleCreateComment = async () => {
    if (!id) return;

    try {
      const nextComment = await createPollComment(id, commentBody);

      if (!nextComment) return;

      setComments((prev) => [nextComment, ...prev]);
      setCommentBody('');

      if (
        pollOwnerId &&
        pollOwnerId !== nextComment.userId &&
        pollOwnerCommentEnabled
      ) {
        void sendCommentPushNotification({
          recipientUserId: pollOwnerId,
          pollId: id,
        });
      }
    } catch {
      showErrorToast('댓글을 작성하지 못했어요');
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;

      try {
        const [nextComments, nextPollOwnerId] = await Promise.all([
          getPollComments(id),
          getPollOwnerId(id),
        ]);
        const nextPollOwnerCommentEnabled =
          await getUserCommentNotificationEnabled(nextPollOwnerId);

        setComments(nextComments);
        setPollOwnerId(nextPollOwnerId);
        setPollOwnerCommentEnabled(nextPollOwnerCommentEnabled);
      } catch {
        showErrorToast('댓글을 불러오지 못했어요');
        setComments([]);
        setPollOwnerId(null);
        setPollOwnerCommentEnabled(true);
      }
    };

    loadComments();
  }, [id]);

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
          전체 댓글 {comments.length}개
        </AppText>
        <AppText tone="muted" variant="caption">
          투표에 대한 생각을 자유롭게 나눠보세요
        </AppText>
      </View>

      <PollCommentComposer
        canSubmit={canSubmit}
        commentBody={commentBody}
        maxLength={COMMENT_MAX_LENGTH}
        onChangeCommentBody={setCommentBody}
        onSubmit={handleCreateComment}
      />

      <PollCommentList comments={comments} />
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
});
