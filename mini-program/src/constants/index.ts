import type { Language, School, LangCode, SchoolCode } from '@/types';

export const LANGUAGES: Language[] = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: '英语', flag: '🇬🇧' },
  { code: 'ja', name: '日语', flag: '🇯🇵' },
  { code: 'ko', name: '韩语', flag: '🇰🇷' },
  { code: 'fr', name: '法语', flag: '🇫🇷' },
  { code: 'es', name: '西语', flag: '🇪🇸' },
  { code: 'de', name: '德语', flag: '🇩🇪' },
  { code: 'ru', name: '俄语', flag: '🇷🇺' },
  { code: 'ar', name: '阿语', flag: '🇸🇦' }
];

export const SCHOOLS: School[] = [
  { code: 'current', name: '本校' },
  { code: 'cupl', name: '中国政法大学' }
];

export const langNameMap: Record<LangCode, string> = LANGUAGES.reduce(
  (acc, l) => ({ ...acc, [l.code]: l.name }),
  {} as Record<LangCode, string>
);

export const schoolNameMap: Record<SchoolCode, string> = SCHOOLS.reduce(
  (acc, s) => ({ ...acc, [s.code]: s.name }),
  {} as Record<SchoolCode, string>
);

/** 互评维度配置 */
export const EVALUATION_DIMENSIONS = [
  { key: 'civility' as const, label: '沟通文明度', icon: '💬', hint: '言辞得体、尊重对方' },
  { key: 'friendliness' as const, label: '友好度', icon: '😊', hint: '态度友善、乐于交流' },
  { key: 'punctuality' as const, label: '守时度', icon: '⏰', hint: '按时赴约、不迟到' },
  { key: 'language' as const, label: '语言能力', icon: '🗣️', hint: '口语流利、表达清晰' }
];
