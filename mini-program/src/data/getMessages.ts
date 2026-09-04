import type { Message } from '@/types';

const messages: Message[] = [
  {
    _id: 'm_001',
    type: 'appointment',
    title: '预约请求',
    content: 'Emma Wilson 想预约你今晚 20:00 进行英语口语练习',
    isRead: false,
    createTime: '2026-08-02T10:30:00Z',
    extra: { partnerOpenid: 'u_002', scheduledTime: '2026-08-02T12:00:00Z' }
  },
  {
    _id: 'm_002',
    type: 'party',
    title: 'Party 邀请',
    content: '田中悠真 邀请你加入「中日双语茶话会」，还差 1 人即可开局',
    isRead: false,
    createTime: '2026-08-02T09:15:00Z',
    extra: { partyId: 'p_002' }
  },
  {
    _id: 'm_003',
    type: 'evaluation',
    title: '互评提醒',
    content: '你与王思琪的练习已结束，请为对方进行互评（24小时内）',
    isRead: false,
    createTime: '2026-08-01T21:00:00Z',
    extra: { appointmentId: 'a_010', targetOpenid: 'u_005' }
  },
  {
    _id: 'm_004',
    type: 'system',
    title: '系统通知',
    content: '欢迎使用「胡说」！完善资料可获得 +5 信用分奖励',
    isRead: true,
    createTime: '2026-07-30T08:00:00Z'
  },
  {
    _id: 'm_005',
    type: 'appointment',
    title: '预约已确认',
    content: 'Kim Minjun 已确认你的预约，明早 9:00 图书馆见',
    isRead: true,
    createTime: '2026-07-29T16:00:00Z',
    extra: { partnerOpenid: 'u_006' }
  },
  {
    _id: 'm_006',
    type: 'evaluation',
    title: '收到新评价',
    content: 'Sofia Garcia 为你打分 4.8 星，评价："非常守时，口语很棒！"',
    isRead: true,
    createTime: '2026-07-28T20:00:00Z'
  }
];

export default function (_data?: Record<string, unknown>): { messages: Message[] } {
  return { messages };
}
