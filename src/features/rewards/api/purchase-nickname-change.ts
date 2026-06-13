import { ensureGuestSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  mapPointTransactionRow,
  type PointTransaction,
  type PointTransactionRow,
} from '../utils/point-transactions';

export const NICKNAME_CHANGE_PRICE = 1000;

export const purchaseNicknameChange = async (
  nickname: string
): Promise<PointTransaction> => {
  const user = await ensureGuestSession();

  if (!user) {
    throw new Error('Guest session is missing.');
  }

  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    throw new Error('Nickname is empty.');
  }

  const { data, error } = await supabase.rpc('purchase_nickname_change', {
    p_nickname: trimmedNickname,
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
