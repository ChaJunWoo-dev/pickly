import {
  hasErrorCode,
  POSTGRES_UNIQUE_VIOLATION_CODE,
} from '@/lib/database-errors';
import { supabase } from '@/lib/supabase';

const CREATE_PROFILE_MAX_ATTEMPTS = 5;

const nicknameAdjectives = [
  '푸른',
  '작은',
  '맑은',
  '빠른',
  '조용한',
  '따뜻한',
  '느긋한',
  '반짝이는',
];

const nicknameNouns = [
  '달',
  '숲',
  '별',
  '바다',
  '구름',
  '햇살',
  '파도',
  '언덕',
];

const getRandomItem = (items: string[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const createNicknameCandidate = () => {
  const adjective = getRandomItem(nicknameAdjectives);
  const noun = getRandomItem(nicknameNouns);
  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `피클러-${adjective}${noun}-${suffix}`;
};

export const createDefaultProfile = async (userId: string) => {
  const { data: existingProfile, error: selectError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (selectError) {
    return false;
  }

  if (existingProfile) {
    return true;
  }

  for (let attempt = 0; attempt < CREATE_PROFILE_MAX_ATTEMPTS; attempt += 1) {
    const { error } = await supabase.from('profiles').insert({
      id: userId,
      nickname: createNicknameCandidate(),
    });

    if (!error) {
      return true;
    }

    if (!hasErrorCode(error, POSTGRES_UNIQUE_VIOLATION_CODE)) {
      return false;
    }
  }

  return false;
};
