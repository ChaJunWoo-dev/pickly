import { theme } from '@/constants/theme';
import type { Ionicons } from '@expo/vector-icons';

export type PollCategoryId =
  | 'food'
  | 'shopping'
  | 'fashion'
  | 'beauty'
  | 'travel'
  | 'entertainment'
  | 'sports'
  | 'tech'
  | 'life'
  | 'feedback'
  | 'etc';

export type PollCategory = {
  id: PollCategoryId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
};

export const pollCategories: Record<PollCategoryId, PollCategory> = {
  food: {
    id: 'food',
    label: '음식',
    icon: 'fast-food-outline',
    color: theme.colors.reward,
    backgroundColor: theme.colors.rewardSoft,
  },
  shopping: {
    id: 'shopping',
    label: '쇼핑',
    icon: 'bag-handle-outline',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.secondarySoft,
  },
  fashion: {
    id: 'fashion',
    label: '패션',
    icon: 'shirt-outline',
    color: theme.colors.primaryStrong,
    backgroundColor: theme.colors.primarySoft,
  },
  beauty: {
    id: 'beauty',
    label: '뷰티',
    icon: 'sparkles-outline',
    color: theme.colors.reward,
    backgroundColor: theme.colors.rewardSoft,
  },
  travel: {
    id: 'travel',
    label: '여행',
    icon: 'airplane-outline',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.secondarySoft,
  },
  entertainment: {
    id: 'entertainment',
    label: '엔터',
    icon: 'film-outline',
    color: theme.colors.warning,
    backgroundColor: theme.colors.warningSoft,
  },
  sports: {
    id: 'sports',
    label: '스포츠',
    icon: 'football-outline',
    color: theme.colors.success,
    backgroundColor: theme.colors.successSoft,
  },
  tech: {
    id: 'tech',
    label: '테크',
    icon: 'phone-portrait-outline',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.secondarySoft,
  },
  life: {
    id: 'life',
    label: '라이프',
    icon: 'leaf-outline',
    color: theme.colors.success,
    backgroundColor: theme.colors.successSoft,
  },
  feedback: {
    id: 'feedback',
    label: '피드백',
    icon: 'chatbubble-ellipses-outline',
    color: theme.colors.secondary,
    backgroundColor: theme.colors.secondarySoft,
  },
  etc: {
    id: 'etc',
    label: '기타',
    icon: 'ellipsis-horizontal-circle-outline',
    color: theme.colors.textMuted,
    backgroundColor: theme.colors.surfaceMuted,
  },
};

export const getPollCategory = (categoryId: PollCategoryId) => {
  return pollCategories[categoryId];
};
