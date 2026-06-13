import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPointTransactionRow,
  type PointTransaction,
  type PointTransactionRow,
} from '../utils/point-transactions';

export const purchaseVoteBooster = async (
  pollId: string
): Promise<PointTransaction> => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const { data, error } = await supabase.rpc('purchase_vote_booster', {
    p_poll_id: pollId,
  });

  if (error) {
    throw error;
  }

  const [pointTransaction] = (data ?? []) as PointTransactionRow[];

  if (!pointTransaction) {
    throw new Error('Point transaction is missing.');
  }

  return mapPointTransactionRow(pointTransaction);
};
