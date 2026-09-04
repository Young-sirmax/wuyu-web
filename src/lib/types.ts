// ============================================
// 胡说 · Web 版类型定义（与原小程序 src/types 保持 1:1）
// ============================================

export type UserRole = "chinese" | "international";

export type SchoolCode = "current" | "cupl";

export interface School {
  code: SchoolCode;
  name: string;
}

export type LangCode = "zh" | "en" | "ja" | "ko" | "fr" | "es" | "de" | "ru" | "ar";

export interface Language {
  code: LangCode;
  name: string;
  flag: string;
}

/** 用户信息（openid 在 Web 版中即会话 sid） */
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
  civility: number;
  friendliness: number;
  punctuality: number;
  language: number;
}

export type PartyStatus = "recruiting" | "full" | "ongoing" | "ended" | "cancelled";

export interface PartyMember {
  openid: string;
  name: string;
  avatar: string;
  role: UserRole;
  isHost: boolean;
}

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

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  _id: string;
  partner: Pick<User, "openid" | "name" | "avatar" | "role" | "nativeLang">;
  language: LangCode;
  scheduledTime: string;
  duration: number;
  status: AppointmentStatus;
  partyId?: string;
  isEvaluated: boolean;
  createTime: string;
}

export interface EvaluationDimensions extends RatingSummary {}

/** 评价（存于评价者名下：targetName/targetAvatar 为被评价对象） */
export interface Evaluation {
  _id: string;
  /** 评价者（我收到评价时的对方） */
  evaluatorName?: string;
  evaluatorAvatar?: string;
  /** 被评价对象（我评价他人时的对方） */
  targetName?: string;
  targetAvatar?: string;
  appointmentId: string;
  dimensions: EvaluationDimensions;
  comment: string;
  createTime: string;
}

export type MessageType = "appointment" | "party" | "evaluation" | "system";

export interface Message {
  _id: string;
  type: MessageType;
  title: string;
  content: string;
  isRead: boolean;
  createTime: string;
  extra?: Record<string, unknown>;
}

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
  user: User | null;
  stats: {
    ratingSummary: RatingSummary;
    appointmentCount: number;
    partyCount: number;
    evaluationCount: number;
  };
  recentEvaluations: Evaluation[];
}

/** 统一 API 响应 */
export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
}
