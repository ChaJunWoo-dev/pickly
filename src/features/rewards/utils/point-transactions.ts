export type PointTransactionType =
  | 'vote_reward'
  | 'poll_create_reward'
  | 'popular_bonus'
  | 'shop_purchase'
  | 'monthly_bonus';

export type PointTransactionRow = {
  id: string;
  user_id: string;
  poll_id: string | null;
  amount: number;
  type: PointTransactionType;
  description: string;
  created_at: string;
};

export type PointTransaction = {
  id: string;
  userId: string;
  pollId: string | null;
  amount: number;
  type: PointTransactionType;
  description: string;
  createdAt: string;
};

export type PointSummary = {
  currentPoints: number;
  monthlyEarnedPoints: number;
  monthlySpentPoints: number;
};

export const mapPointTransactionRow = (
  row: PointTransactionRow
): PointTransaction => {
  return {
    id: row.id,
    userId: row.user_id,
    pollId: row.poll_id,
    amount: row.amount,
    type: row.type,
    description: row.description,
    createdAt: row.created_at,
  };
};

export const getPointSummary = (
  transactions: PointTransaction[],
  now = new Date()
): PointSummary => {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return transactions.reduce<PointSummary>(
    (summary, transaction) => {
      const createdAt = new Date(transaction.createdAt);
      const isCurrentMonth = createdAt >= monthStart;

      summary.currentPoints += transaction.amount;

      if (isCurrentMonth && transaction.amount > 0) {
        summary.monthlyEarnedPoints += transaction.amount;
      }

      if (isCurrentMonth && transaction.amount < 0) {
        summary.monthlySpentPoints += Math.abs(transaction.amount);
      }

      return summary;
    },
    {
      currentPoints: 0,
      monthlyEarnedPoints: 0,
      monthlySpentPoints: 0,
    }
  );
};
