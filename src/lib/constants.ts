import type { Language, School, LangCode, SchoolCode, MessageType } from "@/lib/types";

export const LANGUAGES: Language[] = [
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "en", name: "英语", flag: "🇬🇧" },
  { code: "ja", name: "日语", flag: "🇯🇵" },
  { code: "ko", name: "韩语", flag: "🇰🇷" },
  { code: "fr", name: "法语", flag: "🇫🇷" },
  { code: "es", name: "西语", flag: "🇪🇸" },
  { code: "de", name: "德语", flag: "🇩🇪" },
  { code: "ru", name: "俄语", flag: "🇷🇺" },
  { code: "ar", name: "阿语", flag: "🇸🇦" },
];

export const SCHOOLS: School[] = [
  { code: "current", name: "本校" },
  { code: "cupl", name: "中国政法大学" },
];

export const langNameMap: Record<LangCode, string> = LANGUAGES.reduce(
  (acc, l) => ({ ...acc, [l.code]: l.name }),
  {} as Record<LangCode, string>
);

export const langFlagMap: Record<LangCode, string> = LANGUAGES.reduce(
  (acc, l) => ({ ...acc, [l.code]: l.flag }),
  {} as Record<LangCode, string>
);

export const schoolNameMap: Record<SchoolCode, string> = SCHOOLS.reduce(
  (acc, s) => ({ ...acc, [s.code]: s.name }),
  {} as Record<SchoolCode, string>
);

/** 互评维度配置 */
export const EVALUATION_DIMENSIONS = [
  { key: "civility" as const, label: "沟通文明度", icon: "💬", hint: "言辞得体、尊重对方" },
  { key: "friendliness" as const, label: "友好度", icon: "😊", hint: "态度友善、乐于交流" },
  { key: "punctuality" as const, label: "守时度", icon: "⏰", hint: "按时赴约、不迟到" },
  { key: "language" as const, label: "语言能力", icon: "🗣️", hint: "口语流利、表达清晰" },
];

export const ROLE_OPTIONS = [
  { value: "chinese" as const, label: "中国学生" },
  { value: "international" as const, label: "留学生" },
];

/** 组局状态展示文案 */
export const PARTY_STATUS_TEXT: Record<string, string> = {
  recruiting: "招募中",
  full: "已满员",
  ongoing: "进行中",
  ended: "已结束",
  cancelled: "已取消",
};

/** 消息类型元信息（图标 / 主色） */
export const MESSAGE_TYPE_META: Record<
  MessageType,
  { icon: string; color: string; label: string }
> = {
  appointment: { icon: "📅", color: "#f59e0b", label: "预约" },
  party: { icon: "🎉", color: "#ff6b4a", label: "组局" },
  evaluation: { icon: "⭐", color: "#f7b731", label: "互评" },
  system: { icon: "🔔", color: "#94a3b8", label: "系统" },
};

export const APP_NAME = "胡说";
export const APP_SLOGAN = "找到语伴，开口说外语";
export const CREDIT_BONUS = 5; // 完善资料信用分奖励（沿用原版提示）
