import { AppText, Avatar, Screen } from '@/components';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PollCardData } from '../components/poll-card';
import { PollCategoryPill } from '../components/poll-category-pill';
import { PollCommentPreviewCard } from '../components/poll-comment-preview-card';
import { PollDetailActionSheet } from '../components/poll-detail-action-sheet';
import { PollResultCard } from '../components/poll-result-card';
import { PollTimer } from '../components/poll-timer';
import { mapPollFeedRowToCardData, PollFeedRow } from '../utils/poll-mappers';

export const PollDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [poll, setPoll] = useState<PollCardData | null>(null);
  const [isLoadingPoll, setIsLoadingPoll] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadPoll = async () => {
      setIsLoadingPoll(true);

      try {
        const { data, error } = await supabase
          .from('polls')
          .select(
            `
          id,
          title,
          category,
          reward_points,
          expires_at,
          is_closed,
          poll_options (
            id,
            label,
            image_url,
            sort_order
          ),
          poll_votes (id, option_id)`
          )
          .eq('id', id)
          .single();

        if (error) throw error;

        setPoll(mapPollFeedRowToCardData(data as PollFeedRow));
      } catch (error) {
        setPoll(null);
      } finally {
        setIsLoadingPoll(false);
      }
    };

    loadPoll();
  }, [id]);

  if (isLoadingPoll) {
    return (
      <Screen>
        <AppText>투표를 불러오는 중이에요</AppText>
      </Screen>
    );
  }

  if (!poll) {
    return (
      <Screen>
        <AppText>투표를 찾을 수 없어요</AppText>
      </Screen>
    );
  }

  const selectedOptionId = poll.options[0]?.id;

  return (
    <Screen
      scroll
      contentContainerStyle={styles.content}
      scrollViewProps={{ bounces: false }}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
              return;
            }

            router.replace('/(tabs)');
          }}
          style={styles.iconButton}
        >
          <Ionicons color={theme.colors.text} name="chevron-back" size={22} />
        </Pressable>

        <View style={styles.topActions}>
          <Pressable accessibilityRole="button" style={styles.iconButton}>
            <Ionicons
              color={theme.colors.text}
              name="bookmark-outline"
              size={20}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsActionSheetVisible(true)}
            style={styles.iconButton}
          >
            <Ionicons
              color={theme.colors.text}
              name="ellipsis-horizontal"
              size={20}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.metaRow}>
        <PollCategoryPill categoryId={poll.categoryId} />
        <PollTimer expiresAt={poll.expiresAt} />
      </View>

      <View style={styles.titleBlock}>
        <AppText style={styles.question} variant="title" weight="bold">
          {poll.question}
        </AppText>
        <AppText tone="muted" variant="bodySmall" weight="semibold">
          익명 투표
        </AppText>
      </View>

      <View style={styles.participants}>
        <View style={styles.avatarStack}>
          {['민서', '준호', '하은', '지우', '도윤'].map((name, index) => (
            <View
              key={name}
              style={[styles.avatarWrap, { marginLeft: index ? -8 : 0 }]}
            >
              <Avatar name={name} size="sm" />
            </View>
          ))}
        </View>
        <AppText tone="muted" variant="caption" weight="semibold">
          지금 {poll.participantCount.toLocaleString()}명 참여중
        </AppText>
      </View>

      <View style={styles.voteOptions}>
        {poll.options.slice(0, 2).map((option) => {
          const isSelected = option.id === selectedOptionId;

          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              style={[styles.voteOption, isSelected && styles.voteOptionActive]}
            >
              <View
                style={[
                  styles.checkCircle,
                  isSelected && styles.checkCircleActive,
                ]}
              >
                {isSelected ? (
                  <Ionicons
                    color={theme.colors.inverseText}
                    name="checkmark"
                    size={14}
                  />
                ) : null}
              </View>
              <AppText variant="bodySmall" weight="semibold">
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <PollResultCard
        options={poll.options}
        participantCount={poll.participantCount}
      />

      <PollCommentPreviewCard />

      <PollDetailActionSheet
        onClose={() => setIsActionSheetVisible(false)}
        visible={isActionSheetVisible}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  iconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  question: {
    color: theme.colors.text,
  },
  participants: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatarWrap: {
    borderColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    borderWidth: 2,
  },
  voteOptions: {
    gap: theme.spacing.sm,
  },
  voteOption: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  voteOptionActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primaryStrong,
  },
  checkCircle: {
    alignItems: 'center',
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkCircleActive: {
    backgroundColor: theme.colors.primaryStrong,
    borderColor: theme.colors.primaryStrong,
  },
});
