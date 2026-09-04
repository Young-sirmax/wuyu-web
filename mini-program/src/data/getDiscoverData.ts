import type { DiscoverData, User, Party, ToastmastersClub, Vlog } from '@/types';

const partners: User[] = [
  {
    openid: 'u_002',
    name: 'Emma Wilson',
    phone: '',
    studentId: '2023098765',
    school: 'current',
    schoolName: '本校',
    role: 'international',
    avatar: 'https://picsum.photos/id/91/200/200',
    nativeLang: 'en',
    learnLangs: ['zh'],
    bio: '来自美国，正在学中文，想找语伴练习日常对话',
    creditScore: 95,
    practiceCount: 42,
    ratingAvg: 4.9,
    isOnline: true,
    createTime: '2025-09-02T08:00:00Z'
  },
  {
    openid: 'u_003',
    name: '田中悠真',
    phone: '',
    studentId: '2023055678',
    school: 'current',
    schoolName: '本校',
    role: 'international',
    avatar: 'https://picsum.photos/id/177/200/200',
    nativeLang: 'ja',
    learnLangs: ['zh', 'en'],
    bio: '日本留学生，喜欢中国文化，可以教日语',
    creditScore: 90,
    practiceCount: 35,
    ratingAvg: 4.7,
    isOnline: true,
    createTime: '2025-09-03T08:00:00Z'
  },
  {
    openid: 'u_004',
    name: 'Sofia Garcia',
    phone: '',
    studentId: '2023044321',
    school: 'current',
    schoolName: '本校',
    role: 'international',
    avatar: 'https://picsum.photos/id/338/200/200',
    nativeLang: 'es',
    learnLangs: ['zh', 'en'],
    bio: '西班牙语母语者，热情开朗，想练习中文口语',
    creditScore: 88,
    practiceCount: 20,
    ratingAvg: 4.6,
    isOnline: false,
    createTime: '2025-09-05T08:00:00Z'
  },
  {
    openid: 'u_005',
    name: '王思琪',
    phone: '',
    studentId: '2023011122',
    school: 'current',
    schoolName: '本校',
    role: 'chinese',
    avatar: 'https://picsum.photos/id/1027/200/200',
    nativeLang: 'zh',
    learnLangs: ['en', 'fr'],
    bio: '法语系大三，想去法国交换，正在突击英语和法语',
    creditScore: 93,
    practiceCount: 51,
    ratingAvg: 4.9,
    isOnline: true,
    createTime: '2025-09-06T08:00:00Z'
  },
  {
    openid: 'u_006',
    name: 'Kim Minjun',
    phone: '',
    studentId: '2023066890',
    school: 'current',
    schoolName: '本校',
    role: 'international',
    avatar: 'https://picsum.photos/id/64/200/200',
    nativeLang: 'ko',
    learnLangs: ['zh'],
    bio: '韩国交换生，学中文半年，喜欢美食和旅行',
    creditScore: 87,
    practiceCount: 18,
    ratingAvg: 4.5,
    isOnline: true,
    createTime: '2025-09-08T08:00:00Z'
  },
  {
    openid: 'u_007',
    name: '张子涵',
    phone: '',
    studentId: '2024099112',
    school: 'current',
    schoolName: '本校',
    role: 'chinese',
    avatar: 'https://picsum.photos/id/91/200/200',
    nativeLang: 'zh',
    learnLangs: ['en', 'ja'],
    bio: '英语+日语双学位，喜欢日漫和美剧，欢迎互练',
    creditScore: 91,
    practiceCount: 33,
    ratingAvg: 4.8,
    isOnline: false,
    createTime: '2025-09-10T08:00:00Z'
  }
];

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
  }
];

const club: ToastmastersClub = {
  _id: 'tmc_001',
  name: '本校头马演讲俱乐部',
  school: 'current',
  schoolName: '本校',
  intro: 'Toastmasters International 官方认证校园俱乐部，每周三晚举办例会，提供即兴演讲、备稿演讲、互评反馈等环节，帮助成员提升公众演讲与领导力。',
  meetingTime: '每周三 19:00 - 21:00',
  location: '主楼 302 报告厅',
  memberCount: 48,
  cover: 'https://picsum.photos/id/1015/750/400',
  nextMeeting: '2026-08-06T19:00:00Z'
};

const vlogs: Vlog[] = [
  {
    _id: 'v_001',
    title: '留学生的一天 · 用中文点早餐',
    author: 'Emma Wilson',
    authorAvatar: 'https://picsum.photos/id/91/200/200',
    cover: 'https://picsum.photos/id/292/750/500',
    duration: '03:42',
    plays: 1280,
    createTime: '2026-07-28T08:00:00Z'
  },
  {
    _id: 'v_002',
    title: 'English Vlog｜My Campus Life in Beijing',
    author: '王思琪',
    authorAvatar: 'https://picsum.photos/id/1027/200/200',
    cover: 'https://picsum.photos/id/1039/750/500',
    duration: '05:18',
    plays: 960,
    createTime: '2026-07-25T08:00:00Z'
  },
  {
    _id: 'v_003',
    title: '日语随聊 · 留学生活のつぶやき',
    author: '张子涵',
    authorAvatar: 'https://picsum.photos/id/91/200/200',
    cover: 'https://picsum.photos/id/1044/750/500',
    duration: '04:05',
    plays: 742,
    createTime: '2026-07-22T08:00:00Z'
  }
];

export default function (_data?: Record<string, unknown>): DiscoverData {
  return { partners, parties, club, vlogs };
}
