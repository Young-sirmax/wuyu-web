"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { enDict } from "@/lib/i18n-en";

export type UILang = "zh" | "en";

export const UI_LANG_KEY = "ui-lang";

/** 模板插值：把 {name} 替换为变量 */
export function interp(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined && vars[k] !== null ? String(vars[k]) : `{${k}}`
  );
}

/** 模块级翻译：zh 原文即 key；en 查字典，缺失回退原文 */
export function translate(text: string, lang: UILang, vars?: Record<string, string | number>): string {
  if (lang === "en") {
    const en = enDict[text];
    if (en) return interp(en, vars);
  }
  return interp(text, vars);
}

export function readStoredLang(): UILang {
  if (typeof window === "undefined") return "zh";
  try {
    const ls = localStorage.getItem(UI_LANG_KEY);
    if (ls === "en" || ls === "zh") return ls;
  } catch {
    /* ignore */
  }
  try {
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("zh") ? "zh" : "en";
  } catch {
    return "zh";
  }
}

export function persistLang(l: UILang) {
  try {
    localStorage.setItem(UI_LANG_KEY, l);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${UI_LANG_KEY}=${l};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* ignore */
  }
  try {
    document.documentElement.lang = l === "en" ? "en" : "zh-CN";
  } catch {
    /* ignore */
  }
}

export type TFunc = (text: string, vars?: Record<string, string | number>) => string;

interface I18nValue {
  lang: UILang;
  setLang: (l: UILang) => void;
  t: TFunc;
}

const I18nContext = createContext<I18nValue>({
  lang: "zh",
  setLang: () => {},
  t: (s) => s,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<UILang>("zh");

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  const setLang = useCallback((l: UILang) => {
    setLangState(l);
    persistLang(l);
  }, []);

  const t = useCallback<TFunc>(
    (text, vars) => translate(text, lang, vars),
    [lang]
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}

export function useT(): TFunc {
  return useContext(I18nContext).t;
}
