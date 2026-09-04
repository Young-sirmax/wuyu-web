import type { MyProfile } from '@/types';

const profile: MyProfile = {
  user: {
    openid: 'mock_openid_001',
    name: '李明轩',
    phone: '138****8888',
    studentId: '2023001234',
    school: 'current',
    schoolName: '本校',
    role: 'chinese',
    avatar: 'https://picsum.photos/id/64/200/200',
    nativeLang: 'zh',
    learnLangs: ['en', 'ja'],
    bio: '英语口语爱好者，喜欢和各国同学交流，每周三晚头马俱乐部见！',
    creditScore: 92,
    practiceCount: 28,
    ratingAvg: 4.8,
    isOnline: true,
    createTime: '2025-09-01T08:00:00Z'
  },
  stats: {
    ratingSummary: {
      civility: 4.9,
      friendliness: 4.8,
      punctuality: 4.7,
      language: 4.6
    },
    appointmentCount: 28,
    partyCount: 9,
    evaluationCount: 24
  },
  recentEvaluations: [
    {
      _id: 'e_001',
      targetName: '王思琪',
      targetAvatar: 'https://picsum.photos/id/1027/200/200',
      appointmentId: 'a_008',
      dimensions: { civility: 5, friendliness: 5, punctuality: 5, language: 4 },
      comment: '非常守时，准备充分，口语流利，强烈推荐！',
      createTime: '2026-07-28T20:00:00Z'
    },
    {
      _id: 'e_002',
      targetName: 'Emma Wilson',
      targetAvatar: 'https://picsum.photos/id/91/200/200',
      appointmentId: 'a_007',
      dimensions: { civility: 5, friendliness: 5, punctuality: 4, language: 5 },
      comment: '热情开朗，话题丰富，期待下次再聊',
      createTime: '2026-07-25T19:00:00Z'
    },
    {
      _id: 'e_003',
      targetName: 'Kim Minjun',
      targetAvatar: 'https://picsum.photos/id/64/200/200',
      appointmentId: 'a_006',
      dimensions: { civility: 4, friendliness: 5, punctuality: 4, language: 4 },
      comment: '很友好，中文进步明显',
      createTime: '2026-07-22T18:00:00Z'
    }
  ]
};

export default function (_data?: Record<string, unknown>): MyProfile {
  return profile;
}
