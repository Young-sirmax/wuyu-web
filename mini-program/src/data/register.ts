import type { User } from '@/types';

export default function (data?: Record<string, unknown>) {
  const params = (data || {}) as Record<string, string>;
  const user: User = {
    openid: 'mock_openid_001',
    name: params.name || '新同学',
    phone: params.phone || '138****0000',
    studentId: params.studentId || '2023000000',
    school: (params.school as User['school']) || 'current',
    schoolName: params.school === 'cupl' ? '中国政法大学' : '本校',
    role: (params.role as User['role']) || 'chinese',
    avatar: `https://picsum.photos/id/${[64, 91, 177, 338, 1027][Math.floor(Math.random() * 5)]}/200/200`,
    nativeLang: (params.nativeLang as User['nativeLang']) || 'zh',
    learnLangs: (params.learnLangs as User['learnLangs']) || ['en'],
    bio: '欢迎来到胡说，让我们一起练口语吧！',
    creditScore: 80,
    practiceCount: 0,
    ratingAvg: 0,
    isOnline: true,
    createTime: new Date().toISOString()
  };
  return { user };
}
