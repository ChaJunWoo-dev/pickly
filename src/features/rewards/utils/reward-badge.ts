import type { Ionicons } from '@expo/vector-icons';

export type RewardBadgeRow = {
  id: string;
  label: string;
  icon: string;
  created_at: string;
};

export type RewardBadge = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  createdAt: string;
};

export const mapRewardBadgeRow = (row: RewardBadgeRow): RewardBadge => {
  return {
    id: row.id,
    label: row.label,
    icon: row.icon as keyof typeof Ionicons.glyphMap,
    createdAt: row.created_at,
  };
};

export type PurchasedRewardBadgeRow = {
  badge_id: string;
  badge_label: string;
  badge_icon: string;
  badge_created_at: string;
  point_transaction_id: string;
  point_transaction_user_id: string;
  point_transaction_poll_id: string | null;
  point_transaction_amount: number;
  point_transaction_type: 'shop_purchase';
  point_transaction_description: string;
  point_transaction_created_at: string;
};

export const mapPurchasedRewardBadgeRow = (
  row: PurchasedRewardBadgeRow
) => {
  return {
    badge: mapRewardBadgeRow({
      id: row.badge_id,
      label: row.badge_label,
      icon: row.badge_icon,
      created_at: row.badge_created_at,
    }),
    pointTransaction: {
      id: row.point_transaction_id,
      user_id: row.point_transaction_user_id,
      poll_id: row.point_transaction_poll_id,
      amount: row.point_transaction_amount,
      type: row.point_transaction_type,
      description: row.point_transaction_description,
      created_at: row.point_transaction_created_at,
    },
  };
};
