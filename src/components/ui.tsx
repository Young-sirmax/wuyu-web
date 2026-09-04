"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useToasts, useSession, fmtTime, fmtDate } from "@/lib/client";
import { langFlagMap, langNameMap } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { LangCode, PartyStatus, RatingSummary } from "@/lib/types";

/* ---------------- 头像 ---------------- */
export function Avatar({
  src,
  name,
  size = 44,
  online,
}: {
  src?: string;
  name?: string;
  size?: number;
  online?: boolean;
}) {
  const t = useT();
  return (
    <span style={{ position: "relative", width: size, height: size }}>
      <span
        className="avatar"
        style={{ width: size, height: size, fontSize: Math.max(14, size * 0.38) }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name || t("头像")} loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          (name || "?").slice(0, 1)
        )}
      </span>
      {online ? <i className="online-dot" style={{ position: "absolute" }} /> : null}
    </span>
  );
}

/* ---------------- 星级 ---------------- */
export function Stars({ value, size = 13 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? "" : "off"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function RatingBlock({
  avg,
  dimensions,
}: {
  avg?: number;
  dimensions?: RatingSummary;
}) {
  const t = useT();
  const dims = dimensions
    ? [
        { k: "civility", label: t("沟通文明度") },
        { k: "friendliness", label: t("友好度") },
        { k: "punctuality", label: t("守时度") },
        { k: "language", label: t("语言能力") },
      ]
    : [];
  if (!dimensions && avg === undefined) return null;
  return (
    <div className="card">
      {avg !== undefined && (
        <div className="row-between" style={{ marginBottom: dimensions ? 10 : 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{t("综合评分")}</span>
          <span style={{ fontWeight: 800, color: "#f59e0b", fontSize: 20 }}>
            {avg.toFixed(1)} <Stars value={avg} />
          </span>
        </div>
      )}
      {dims.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
          {dims.map((d) => (
            <div key={d.k} className="row-between">
              <span className="muted">{d.label}</span>
              <span>
                <b style={{ color: "#f59e0b" }}>{((dimensions as any)[d.k] || 0).toFixed(1)}</b>
                <span style={{ fontSize: 12, marginLeft: 4 }}>
                  <Stars value={dimensions![d.k as keyof typeof dimensions] || 0} size={11} />
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- 语言标签 ---------------- */
export function LangTag({ code }: { code: LangCode }) {
  const t = useT();
  return (
    <span className="lang-tag">
      {langFlagMap[code] || "🌐"} {t(langNameMap[code] || code)}
    </span>
  );
}

/* ---------------- 组局状态 ---------------- */
export function StatusTag({ status }: { status: PartyStatus }) {
  const t = useT();
  const map: Record<string, { text: string; cls: string }> = {
    recruiting: { text: t("招募中"), cls: "tag-green" },
    full: { text: t("已满员"), cls: "tag-red" },
    ongoing: { text: t("进行中"), cls: "tag-blue" },
    ended: { text: t("已结束"), cls: "tag-gray" },
    cancelled: { text: t("已取消"), cls: "tag-gray" },
  };
  const m = map[status] || map.ended;
  return <span className={`tag ${m.cls}`}>{m.text}</span>;
}

/* ---------------- 空状态 ---------------- */
export function Empty({ icon = "🗂️", text }: { icon?: string; text: string }) {
  return (
    <div className="empty">
      <div className="e-ico">{icon}</div>
      <div className="e-text">{text}</div>
    </div>
  );
}

/* ---------------- Toast 容器 ---------------- */
export function ToastViewport() {
  const list = useToasts();
  const t = useT();
  return (
    <div className="toast-wrap">
      {list.map((x) => (
        <div key={x.id} className={`toast toast-${x.type}`}>
          {t(x.text)}
        </div>
      ))}
    </div>
  );
}

/* ---------------- 顶部标题栏 ---------------- */
export function NavBar({ title, right, back }: { title: string; right?: ReactNode; back?: boolean }) {
  const router = useRouter();
  const t = useT();
  return (
    <div className="navbar">
      {back !== false && (
        <button className="nav-back" onClick={() => router.back()} aria-label={t("返回")}>
          ‹
        </button>
      )}
      <div className="nav-title">{title}</div>
      {right ? <div className="nav-right">{right}</div> : null}
    </div>
  );
}

/* ---------------- 底部 Tab ---------------- */
export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSession();
  const t = useT();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (pathname === "/message" || !user) return;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && Array.isArray(res.data)) {
          setUnread(res.data.filter((m: any) => !m.isRead).length);
        }
      })
      .catch(() => {});
  }, [pathname, user]);

  const tabs = [
    { key: "/home", label: t("发现"), icon: "🌍" },
    { key: "/party", label: t("组局"), icon: "🤝" },
    { key: "/mine", label: t("我的"), icon: user ? "🙋" : "👤" },
    { key: "/message", label: t("消息"), icon: "🔔" },
  ];
  return (
    <nav className="tabbar">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.key);
        return (
          <button
            key={tab.key}
            className={`tabbar-item${active ? " active" : ""}`}
            onClick={() => router.push(tab.key)}
          >
            <span className="ico">
              {tab.icon}
              {tab.key === "/message" && unread > 0 ? (
                <i className="badge">{unread > 99 ? "99+" : unread}</i>
              ) : null}
            </span>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------- 骨架 ---------------- */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ marginBottom: 12, height: 84 }} />
      ))}
    </>
  );
}

/* ---------------- 空内容占位 CTA（未注册） ---------------- */
export function NeedRegister({ text }: { text?: string }) {
  const router = useRouter();
  const t = useT();
  return (
    <div className="empty">
      <div className="e-ico">🪪</div>
      <div className="e-text">{text ?? t("注册后解锁全部功能")}</div>
      <button className="btn btn-primary mt-12" onClick={() => router.push("/register")}>
        {t("立即注册")}
      </button>
    </div>
  );
}

/* ---------------- 时间文本 ---------------- */
export function TimeText({ iso, full }: { iso?: string; full?: boolean }) {
  if (!iso) return null;
  return <span className="muted">{full ? `${fmtDate(iso)} ${fmtTime(iso)}` : fmtTime(iso)}</span>;
}

/* ---------------- 链接式卡片 ---------------- */
export function CardLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
