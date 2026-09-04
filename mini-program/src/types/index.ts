// ============================================
// 胡说 - 全局类型定义
// ============================================

/** 用户角色 */
export type UserRole = 'chinese' | 'international';

/** 学校 */
export type SchoolCode = 'current' | 'cupl';

export interface School {
  code: SchoolCode;
  name: string;
}

/** 语言代码 */
export type LangCode = 'zh' | 'en' | 'ja' | 'ko' | 'fr' | 'es' | 'de' | 'ru' | 'ar';

export interface Language {
  code: LangCode;
  name: string;
  flag: string;
}

/** 用户信息 */
export interface User {
  openid: string;
  name: string;
  phone: string;
  studentId: string;
  school: SchoolCode;
  schoolName: string;
  role: UserRole;
  avatar: string;
  nativeLang: LangCode;
  learnLangs: LangCode[];
  bio: string;
  creditScore: number;
  practiceCount: number;
  ratingAvg: number;
  isOnline: boolean;
  createTime: string;
}

/** 信用评分维度快照 */
export interface RatingSummary {
  civility: number; // 沟通文明度
  friendliness: number; // 友好度
  punctuality: number; // 守时度
  language: number; // 语言能力
}

/** 组局状态 */
export type PartyStatus = 'recruiting' | 'full' | 'ongoing' | 'ended' | 'cancelled';

/** 组局成员 */
export interface PartyMember {
  openid: string;
  name: string;
  avatar: string;
  role: UserRole;
  isHost: boolean;
}

/** 组局 */
export interface Party {
  _id: string;
  title: string;
  topic: string;
  language: LangCode;
  school: SchoolCode;
  schoolName: string;
  host: PartyMember;
  members: PartyMember[];
  maxMembers: number;
  status: PartyStatus;
  scheduledTime: string;
  location: string;
  createTime: string;
}

/** 预约状态 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/** 预约 */
export interface Appointment {
  _id: string;
  partner: Pick<User, 'openid' | 'name' | 'avatar' | 'role' | 'nativeLang'>;
  language: LangCode;
  scheduledTime: string;
  duration: number;
  status: AppointmentStatus;
  partyId?: string;
  isEvaluated: boolean;
  createTime: string;
}

/** 评价维度 */
export interface EvaluationDimensions extends RatingSummary {}

/** 评价 */
export interface Evaluation {
  _id: string;
  targetName: string;
  targetAvatar: string;
  appointmentId: string;
  dimensions: EvaluationDimensions;
  comment: string;
  createTime: string;
}

/** 消息类型 */
export type MessageType = 'appointment' | 'party' | 'evaluation' | 'system';

/** 消息 */
export interface Message {
  _id: string;
  type: MessageType;
  title: string;
  content: string;
  isRead: boolean;
  createTime: string;
  extra?: Record<string, unknown>;
}

/** 头马俱乐部 */
export interface ToastmastersClub {
  _id: string;
  name: string;
  school: SchoolCode;
  schoolName: string;
  intro: string;
  meetingTime: string;
  location: string;
  memberCount: number;
  cover: string;
  nextMeeting: string;
}

/** Vlog */
export interface Vlog {
  _id: string;
  title: string;
  author: string;
  authorAvatar: string;
  cover: string;
  duration: string;
  plays: number;
  createTime: string;
}

/** 首页聚合数据 */
export interface DiscoverData {
  partners: User[];
  parties: Party[];
  club: ToastmastersClub;
  vlogs: Vlog[];
}

/** 我的资料聚合 */
export interface MyProfile {
  user: User;
  stats: {
    ratingSummary: RatingSummary;
    appointmentCount: number;
    partyCount: number;
    evaluationCount: number;
  };
  recentEvaluations: Evaluation[];
}
