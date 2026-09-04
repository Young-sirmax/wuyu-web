import type { Party } from '@/types';

export default function (data?: Record<string, unknown>): { party: Party } {
  const params = (data || {}) as Record<string, unknown>;
  const party: Party = {
    _id: 'p_new_' + Date.now(),
    title: (params.title as string) || '新组局',
    topic: (params.topic as string) || '自由讨论',
    language: (params.language as Party['language']) || 'en',
    school: 'current',
    schoolName: '本校',
    host: {
      openid: 'mock_openid_001',
      name: '李明轩',
      avatar: 'https://picsum.photos/id/64/200/200',
      role: 'chinese',
      isHost: true
    },
    members: [
      {
        openid: 'mock_openid_001',
        name: '李明轩',
        avatar: 'https://picsum.photos/id/64/200/200',
        role: 'chinese',
        isHost: true
      }
    ],
    maxMembers: 3,
    status: 'recruiting',
    scheduledTime: (params.scheduledTime as string) || new Date().toISOString(),
    location: (params.location as string) || '待定',
    createTime: new Date().toISOString()
  };
  return { party };
}
