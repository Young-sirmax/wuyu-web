import type { Party } from '@/types';

const parties: Party[] = [
  {
    _id: 'p_001',
    title: '周末英语角 · 自由话题',
    topic: '聊聊你最近看的一部电影',
    language: 'en',
    school: 'current',
    schoolName: '本校',
    host: { openid: 'u_002', name: 'Emma Wilson', avatar: 'https://picsum.photos/id/91/200/200', role: 'international', isHost: true },
    members: [
      { openid: 'u_002', name: 'Emma Wilson', avatar: 'https://picsum.photos/id/91/200/200', role: 'international', isHost: true },
      { openid: 'u_005', name: '王思琪', avatar: 'https://picsum.photos/id/1027/200/200', role: 'chinese', isHost: false }
    ],
    maxMembers: 3,
    status: 'recruiting',
    scheduledTime: '2026-08-03T14:00:00Z',
    location: '图书馆三楼研讨室A',
    createTime: '2026-08-01T10:00:00Z'
  },
  {
    _id: 'p_002',
    title: '中日双语茶话会',
    topic: '中日文化差异小讨论',
    language: 'ja',
    school: 'current',
    schoolName: '本校',
    host: { openid: 'u_003', name: '田中悠真', avatar: 'https://picsum.photos/id/177/200/200', role: 'international', isHost: true },
    members: [
      { openid: 'u_003', name: '田中悠真', avatar: 'https://picsum.photos/id/177/200/200', role: 'international', isHost: true },
      { openid: 'u_007', name: '张子涵', avatar: 'https://picsum.photos/id/91/200/200', role: 'chinese', isHost: false }
    ],
    maxMembers: 3,
    status: 'recruiting',
    scheduledTime: '2026-08-04T19:00:00Z',
    location: '留学生活动中心',
    createTime: '2026-08-01T11:00:00Z'
  },
  {
    _id: 'p_003',
    title: '雅思口语冲刺局',
    topic: 'Part 2 话题卡轮流练习',
    language: 'en',
    school: 'cupl',
    schoolName: '中国政法大学',
    host: { openid: 'u_005', name: '王思琪', avatar: 'https://picsum.photos/id/1027/200/200', role: 'chinese', isHost: true },
    members: [
      { openid: 'u_005', name: '王思琪', avatar: 'https://picsum.photos/id/1027/200/200', role: 'chinese', isHost: true },
      { openid: 'u_004', name: 'Sofia Garcia', avatar: 'https://picsum.photos/id/338/200/200', role: 'international', isHost: false },
      { openid: 'u_006', name: 'Kim Minjun', avatar: 'https://picsum.photos/id/64/200/200', role: 'international', isHost: false }
    ],
    maxMembers: 3,
    status: 'full',
    scheduledTime: '2026-08-05T15:00:00Z',
    location: '线上 Zoom',
    createTime: '2026-07-30T09:00:00Z'
  },
  {
    _id: 'p_004',
    title: '西语初学者互助局',
    topic: '日常问候与自我介绍',
    language: 'es',
    school: 'current',
    schoolName: '本校',
    host: { openid: 'u_004', name: 'Sofia Garcia', avatar: 'https://picsum.photos/id/338/200/200', role: 'international', isHost: true },
    members: [
      { openid: 'u_004', name: 'Sofia Garcia', avatar: 'https://picsum.photos/id/338/200/200', role: 'international', isHost: true }
    ],
    maxMembers: 3,
    status: 'recruiting',
    scheduledTime: '2026-08-06T16:00:00Z',
    location: '咖啡厅二楼',
    createTime: '2026-08-02T09:00:00Z'
  }
];

export default function (data?: Record<string, unknown>): { parties: Party[] } {
  const filter = (data?.filter as string) || 'all';
  if (filter === 'mine') {
    return { parties: parties.filter((p) => p.host.openid === 'mock_openid_001') };
  }
  return { parties };
}
