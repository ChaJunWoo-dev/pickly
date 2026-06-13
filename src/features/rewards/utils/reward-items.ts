import { Ionicons } from '@expo/vector-icons';

export type RewardItemType =
  | 'nickname_change'
  | 'random_badge'
  | 'vote_booster';

export type RewardItemRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  icon: string;
  type: RewardItemType;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string | null;
};

export type RewardItem = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  icon: keyof typeof Ionicons.glyphMap;
  type: RewardItemType;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string | null;
};

export const mapRewardItemRow = (row: RewardItemRow): RewardItem => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    icon: row.icon as keyof typeof Ionicons.glyphMap,
    type: row.type,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};
