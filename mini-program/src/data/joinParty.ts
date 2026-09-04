import type { Party } from '@/types';

export default function (data?: Record<string, unknown>): { party: Party } {
  const params = (data || {}) as Record<string, unknown>;
  const party: Party = {
    _id: (params.partyId as string) || 'p_001',
    title: '周末英语角 · 自由话题',
    topic: '聊聊你最近看的一部电影',
    language: 'en',
    school: 'current',
    schoolName: '本校',
    host: { openid: 'u_002', name: 'Emma Wilson', avatar: 'https://picsum.photos/id/91/200/200', role: 'international', isHost: true },
    members: [
      { openid: 'u_002', name: 'Emma Wilson', avatar: 'https://picsum.photos/id/91/200/200', role: 'international', isHost: true },
      { openid: 'u_005', name: '王思琪', avatar: 'https://picsum.photos/id/1027/200/200', role: 'chinese', isHost: false },
      { openid: 'mock_openid_001', name: '李明轩', avatar: 'https://picsum.photos/id/64/200/200', role: 'chinese', isHost: false }
    ],
    maxMembers: 3,
    status: 'full',
    scheduledTime: '2026-08-03T14:00:00Z',
    location: '图书馆三楼研讨室A',
    createTime: '2026-08-01T10:00:00Z'
  };
  return { party };
}
