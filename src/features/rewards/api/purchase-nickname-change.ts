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

  const { data: previousProfile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .maybeSingle();

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      nickname: trimmedNickname,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('id')
    .single();

  if (profileError) {
    throw profileError;
  }

  const { data, error: pointTransactionError } = await supabase
    .from('point_transactions')
    .insert({
      amount: -NICKNAME_CHANGE_PRICE,
      description: '닉네임 변경',
      poll_id: null,
      type: 'shop_purchase',
      user_id: user.id,
    })
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
    .single();

  if (pointTransactionError) {
    await supabase
      .from('profiles')
      .update({
        nickname: previousProfile?.nickname ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    throw pointTransactionError;
  }

  return mapPointTransactionRow(data as PointTransactionRow);
};
