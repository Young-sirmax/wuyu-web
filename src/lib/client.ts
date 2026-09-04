"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  User,
  DiscoverData,
  MyProfile,
  Party,
  Message,
  ToastmastersClub,
  Vlog,
  RatingSummary,
} from "@/lib/types";

/* ---------------- 轻量全局状态（避免引入状态库） ---------------- */

type UserEvent = { user: User | null; loaded: boolean };
let userState: UserEvent = { user: null, loaded: false };
const userListeners = new Set<(s: UserEvent) => void>();

export function setUserState(next: Partial<UserEvent>) {
  userState = { ...userState, ...next };
  userListeners.forEach((fn) => fn(userState));
}

export function getSessionUser() {
  return userState.user;
}

/* ---------------- 通用请求封装 ---------------- */

export async function api<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; data?: T; error?: string; code?: string; status: number }> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...options,
  });
  let body: any = {};
  try {
    body = await res.json();
  } catch {
    body = { ok: false, error: "服务响应异常" };
  }
  return { ...body, status: res.status };
}

/* ---------------- 类型化 API（页面统一经由此处调用） ---------------- */

export const userApi = {
  login: () => api<{ user: User | null; sid: string }>("/api/login"),
  register: (payload: Record<string, unknown>) =>
    api<{ user: User; isNew: boolean }>("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  profile: () => api<MyProfile>("/api/profile"),
  discover: () => api<DiscoverData>("/api/discover"),
  getPublicUser: (openid: string) => api<{ user: User; ratingSummary: RatingSummary; evaluationCount: number }>(`/api/users/${openid}`),
};

export const partyApi = {
  list: (scope?: "mine") => api<Party[]>(`/api/parties${scope ? "?scope=mine" : ""}`),
  detail: (id: string) => api<{ party: Party }>(`/api/parties/${id}`),
  create: (payload: Record<string, unknown>) =>
    api<{ party: Party }>("/api/parties", { method: "POST", body: JSON.stringify(payload) }),
  join: (id: string) => api<{ party: Party }>(`/api/parties/${id}/join`, { method: "POST" }),
};

export const messageApi = {
  list: () => api<Message[]>("/api/messages"),
  markRead: (id: string) =>
    api<{ id: string; isRead: boolean }>("/api/messages", { method: "PATCH", body: JSON.stringify({ id }) }),
};

export const evaluateApi = {
  submit: (payload: { targetOpenid: string; appointmentId: string; dimensions: Record<string, number>; comment: string }) =>
    api<{ evaluationId: string; target: { name: string; avatar: string; ratingAvg: number } }>("/api/evaluate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const contentApi = {
  toastmasters: () => api<ToastmastersClub[]>("/api/toastmasters"),
  vlogs: () => api<{ vlogs: Vlog[] }>("/api/vlogs"),
};

/* ---------------- Toast（全局轻提示） ---------------- */

type ToastItem = { id: number; text: string; type: "info" | "success" | "error" };
let toastId = 0;
const toastListeners = new Set<(t: ToastItem[]) => void>();
let toasts: ToastItem[] = [];

function emitToasts() {
  toastListeners.forEach((fn) => fn([...toasts]));
}

export function toast(text: string, type: ToastItem["type"] = "info") {
  const item: ToastItem = { id: ++toastId, text, type };
  toasts = [...toasts, item];
  emitToasts();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== item.id);
    emitToasts();
  }, 2400);
}

export function useToasts() {
  const [list, setList] = useState<ToastItem[]>([]);
  useEffect(() => {
    const fn = (t: ToastItem[]) => setList(t);
    toastListeners.add(fn);
    return () => {
      toastListeners.delete(fn);
    };
  }, []);
  return list;
}

/* ---------------- 会话 / 用户 Hooks ---------------- */

/** 全局会话：首次加载拉取 /api/login，供所有页面共享用户态 */
export function useSession() {
  const [state, setState] = useState<UserEvent>(userState);
  useEffect(() => {
    const fn = (s: UserEvent) => setState(s);
    userListeners.add(fn);
    return () => {
      userListeners.delete(fn);
    };
  }, []);

  useEffect(() => {
    if (userState.loaded) return;
    userApi
      .login()
      .then((res) => {
        setUserState({ user: res.data?.user ?? null, loaded: true });
      })
      .catch(() => setUserState({ user: null, loaded: true }));
  }, []);

  return state;
}

export function useUser() {
  const s = useSession();
  return s.user;
}

/** 统一错误处理：API 返回 NEED_REGISTER 时跳转注册页 */
export async function guardResult<T extends { ok: boolean; error?: string; code?: string }>(
  res: T
): Promise<T | null> {
  if (res.ok) return res;
  if (res.code === "NEED_REGISTER") {
    toast("请先注册或完善资料", "info");
    window.setTimeout(() => {
      window.location.href = "/register";
    }, 600);
    return null;
  }
  toast(res.error || "操作失败", "error");
  return null;
}

/* ---------------- 通用数据 Hook ---------------- */

export function useAsyncData<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    setLoading(true);
    fn()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, reload, setData };
}

/* ---------------- 格式化 ---------------- */

export function fmtTime(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fmtRelative(
  iso?: string,
  t?: (key: string, vars?: Record<string, string | number>) => string
): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return t ? t("刚刚") : "刚刚";
  if (min < 60) return t ? t("{n} 分钟前", { n: min }) : `${min} 分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return t ? t("{n} 小时前", { n: h }) : `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 30) return t ? t("{n} 天前", { n: d }) : `${d} 天前`;
  return fmtDate(iso);
}
