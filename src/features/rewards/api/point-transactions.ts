import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPointTransactionRow,
  type PointTransaction,
  type PointTransactionRow,
} from '../utils/point-transactions';

export const getPointTransactions = async (): Promise<PointTransaction[]> => {
  const user = await ensureGuestSession();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('point_transactions')
    .select(
      `
      id,
      user_id,
      poll_id,
      amount,
      type,
      description,
      created_at
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PointTransactionRow[]).map(mapPointTransactionRow);
};
