"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useAsyncData, messageApi, toast, fmtRelative } from "@/lib/client";
import { TabBar, Empty, SkeletonList } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Message, MessageType } from "@/lib/types";

const TYPE_META: Record<MessageType, { icon: string; color: string }> = {
  appointment: { icon: "📅", color: "#f59e0b" },
  party: { icon: "🎉", color: "#ff6b4a" },
  evaluation: { icon: "⭐", color: "#f7b731" },
  system: { icon: "🔔", color: "#94a3b8" },
};

export default function MessagePage() {
  const router = useRouter();
  const t = useT();
  const { user, loaded } = useSession();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const msgs = useAsyncData(async () => {
    const res = await messageApi.list();
    if (res.ok) return res.data ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, [user?.openid]);

  const list = (msgs.data || []).filter((m) => (filter === "unread" ? !m.isRead : true));

  async function onOpen(m: Message) {
    // 标记已读并跳转关联业务
    if (!m.isRead) {
      messageApi.markRead(m._id).then((r) => {
        if (r.ok && msgs.data) {
          msgs.setData(msgs.data.map((x) => (x._id === m._id ? { ...x, isRead: true } : x)));
        }
      });
    }
    const extra = m.extra as any;
    if (m.type === "evaluation" && extra?.targetOpenid) {
      router.push(
        `/evaluation?targetOpenid=${extra.targetOpenid}&appointmentId=${extra.appointmentId || ""}&targetName=${encodeURIComponent(extra.targetName || "")}`
      );
      return;
    }
    if (m.type === "party" && extra?.partyId) {
      router.push(`/party-detail?id=${extra.partyId}`);
      return;
    }
    if (m.type === "appointment") {
      toast(t("已在消息中确认，记得按时赴约哦"), "success");
      return;
    }
    setExpanded(expanded === m._id ? null : m._id);
  }

  if (!loaded) {
    return (
      <div className="shell tab-page">
        <SkeletonList count={4} />
        <TabBar />
      </div>
    );
  }

  return (
    <div className="shell tab-page">
      <header className="brand-header">
        <div className="hello">
          {t("消息中心")}
          <small>{t("预约、组局与互评动态都在这里")}</small>
        </div>
      </header>

      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        {(
          [
            { key: "all", label: t("全部") },
            { key: "unread", label: t("未读") },
          ] as { key: "all" | "unread"; label: string }[]
        ).map((it) => {
          const unreadCount = (msgs.data || []).filter((m) => !m.isRead).length;
          return (
            <button
              key={it.key}
              className={`radio-pill${filter === it.key ? " active" : ""}`}
              onClick={() => setFilter(it.key)}
            >
              {it.label}
              {it.key === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
            </button>
          );
        })}
      </div>

      {msgs.loading ? (
        <SkeletonList count={4} />
      ) : !user ? (
        <Empty icon="🔔" text={t("注册后可接收预约、组局与互评消息")} />
      ) : list.length === 0 ? (
        <Empty icon="🔕" text={filter === "unread" ? t("没有未读消息") : t("暂无消息")} />
      ) : (
        <div>
          {list.map((m) => {
            const meta = TYPE_META[m.type] || TYPE_META.system;
            const isExpanded = expanded === m._id;
            return (
              <button
                key={m._id}
                className="card row"
                style={{ gap: 12, width: "100%", textAlign: "left", opacity: m.isRead ? 0.72 : 1 }}
                onClick={() => onOpen(m)}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${meta.color}1f`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {meta.icon}
                  {!m.isRead && (
                    <i
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#ef4444",
                      }}
                    />
                  )}
                </span>
                <span className="body">
                  <span className="row-between">
                    <b className="title" style={{ fontSize: 14.5 }}>
                      {t(m.title)}
                    </b>
                    <span className="muted">{fmtRelative(m.createTime, t)}</span>
                  </span>
                  <span className="sub" style={{ WebkitLineClamp: isExpanded ? 10 : 2 }}>
                    {t(m.content)}
                  </span>
                  {(m.type === "evaluation" || m.type === "party") && !isExpanded && (
                    <span className="btn btn-primary btn-sm mt-6" style={{ padding: "4px 12px", fontSize: 12 }}>
                      {m.type === "evaluation" ? `${t("去互评")} ›` : `${t("查看组局")} ›`}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <TabBar />
    </div>
  );
}
