import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPointTransactionRow,
  type PointTransaction,
} from '../utils/point-transactions';
import {
  mapPurchasedRewardBadgeRow,
  type PurchasedRewardBadgeRow,
  type RewardBadge,
} from '../utils/reward-badge';

export type PurchaseRandomBadgeResult = {
  badge: RewardBadge;
  transaction: PointTransaction;
};

export const purchaseRandomBadge =
  async (): Promise<PurchaseRandomBadgeResult> => {
    const user = await ensureGuestSession();

    if (!user) {
      throw new Error('Guest session is missing.');
    }

    const { data, error } = await supabase.rpc('purchase_random_badge');

    if (error) {
      throw error;
    }

    const [purchaseResult] = (data ?? []) as PurchasedRewardBadgeRow[];

    if (!purchaseResult) {
      throw new Error('Random badge purchase result is missing.');
    }

    const { badge, pointTransaction } =
      mapPurchasedRewardBadgeRow(purchaseResult);

    return {
      badge,
      transaction: mapPointTransactionRow(pointTransaction),
    };
  };
