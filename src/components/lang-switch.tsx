"use client";

import { useI18n } from "@/lib/i18n";

/** 全局语言切换：中文界面显示 EN，英文界面显示 中 */
export function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  const toEn = lang === "zh";
  return (
    <button
      type="button"
      className="lang-switch"
      aria-label={t(toEn ? "切换到英文" : "切换到中文")}
      title={t(toEn ? "切换到英文" : "切换到中文")}
      onClick={() => setLang(toEn ? "en" : "zh")}
    >
      {toEn ? "EN" : "中"}
    </button>
  );
}
