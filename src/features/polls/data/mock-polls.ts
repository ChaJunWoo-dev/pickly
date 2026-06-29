import type { PollCardData } from '../components/poll-card';

export const featuredPolls: PollCardData[] = [
  {
    id: 'daily-lunch',
    categoryId: 'shopping',
    question: '오늘 하나만 산다면?',
    options: [
      {
        id: 'sneakers',
        label: '운동화',
        percent: 58,
        imageUrl:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'bag',
        label: '가방',
        percent: 42,
        imageUrl:
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=240&q=80',
      },
    ],
    rewardPoints: 12,
    participantCount: 1248,
    timeLeft: '02:34:33',
    timeLeftSeconds: 9273,
  },
  {
    id: 'weekend-plan',
    categoryId: 'life',
    question: '이번 주말엔 어떤 시간이 더 좋아?',
    options: [
      { id: 'outside', label: '밖에서 길게 걷기', percent: 47 },
      { id: 'home', label: '집에서 푹 쉬기', percent: 53 },
    ],
    rewardPoints: 8,
    participantCount: 903,
    timeLeft: '05:12:08',
    timeLeftSeconds: 18728,
    hasVoted: true,
  },
  {
    id: 'new-feature',
    categoryId: 'entertainment',
    question: '주말에 뭐 볼까?',
    options: [
      {
        id: 'drama',
        label: '드라마 정주행',
        percent: 55,
        imageUrl:
          'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'movie',
        label: '영화 보기',
        percent: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=160&q=80',
      },
      {
        id: 'animation',
        label: '애니 몰아보기',
        percent: 15,
        imageUrl:
          'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=160&q=80',
      },
    ],
    rewardPoints: 20,
    participantCount: 2311,
    timeLeft: '28:48:11',
    timeLeftSeconds: 103691,
  },
];
