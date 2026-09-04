import type { User } from '@/types';

const mockUser: User = {
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
};

export default function (_data?: Record<string, unknown>) {
  return {
    openid: 'mock_openid_001',
    isRegistered: true,
    user: mockUser
  };
}
