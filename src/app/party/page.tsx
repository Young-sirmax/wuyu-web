"use client";

import Link from "next/link";
import { useState } from "react";
import { partyApi, useAsyncData, toast } from "@/lib/client";
import { TabBar, Empty, SkeletonList, Avatar, LangTag, StatusTag, TimeText } from "@/components/ui";
import { langNameMap } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { Party } from "@/lib/types";

type Scope = "all" | "mine";

export default function PartyPage() {
  const [scope, setScope] = useState<Scope>("all");
  const [lang, setLang] = useState<string>("all");
  const t = useT();
  const list = useAsyncData(async () => {
    const res = await partyApi.list(scope === "mine" ? "mine" : undefined);
    if (res.ok) return res.data ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, [scope]);

  const parties = list.data || [];
  const filtered =
    lang === "all"
      ? parties
      : parties.filter(
          (p) =>
            p.language === lang || (p.members || []).some((m) => m.role === "international")
        );

  return (
    <div className="shell tab-page">
      <header className="brand-header">
        <div className="hello">
          {t("口语组局")}
          <small>{t("找搭子，一起开口练")}</small>
        </div>
        <Link href="/create-party" className="btn btn-primary btn-sm">
          ＋ {t("发起组局")}
        </Link>
      </header>

      {/* 范围切换 */}
      <div className="row" style={{ gap: 8, marginBottom: 12 }}>
        {(
          [
            { key: "all", label: t("全部组局") },
            { key: "mine", label: t("我参与的") },
          ] as { key: Scope; label: string }[]
        ).map((it) => (
          <button
            key={it.key}
            className={`radio-pill${scope === it.key ? " active" : ""}`}
            onClick={() => setScope(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>

      {/* 语言过滤 */}
      {scope === "all" && (
        <div className="row" style={{ gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {["all", "en", "ja", "es", "ko", "zh"].map((l) => (
            <button
              key={l}
              className={`radio-pill${lang === l ? " active" : ""}`}
              style={{ padding: "5px 12px", fontSize: 13 }}
              onClick={() => setLang(l)}
            >
              {l === "all" ? t("全部语言") : t(langNameMap[l as keyof typeof langNameMap] || l)}
            </button>
          ))}
        </div>
      )}

      {list.loading ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 ? (
        <Empty
          icon="🤝"
          text={
            scope === "mine"
              ? t("你还没有参与任何组局，去「全部组局」看看吧")
              : t("暂无符合条件的组局，发起一个？")
          }
        />
      ) : (
        <div className="grid-2" style={{ display: "grid", gap: 12 }}>
          {filtered.map((p: Party) => (
            <PartyCard key={p._id} party={p} mine={scope === "mine"} />
          ))}
        </div>
      )}
      <TabBar />
    </div>
  );
}

function PartyCard({ party, mine }: { party: Party; mine?: boolean }) {
  const t = useT();
  return (
    <Link href={`/party-detail?id=${party._id}`} className="card" style={{ display: "block" }}>
      <div className="row-between">
        <span className="title" style={{ fontSize: 16 }}>
          {party.title}
        </span>
        <StatusTag status={party.status} />
      </div>
      <div className="muted mt-6" style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        <LangTag code={party.language} />
        <span className="tag tag-outline">🎓 {t(party.schoolName)}</span>
        {mine && <span className="tag tag-blue">{t("已参与")}</span>}
      </div>
      <div className="muted mt-6" style={{ fontSize: 13, lineHeight: 1.5 }}>
        💬 {party.topic || t("自由交流")}
      </div>
      <div className="row-between mt-6">
        <div className="row" style={{ gap: 6, minWidth: 0 }}>
          <span style={{ display: "flex", marginRight: 2 }}>
            {party.members.slice(0, 3).map((m) => (
              <span key={m.openid} style={{ marginLeft: -7 }}>
                <Avatar src={m.avatar} name={m.name} size={26} />
              </span>
            ))}
          </span>
          <span className="muted">
            {t("{a}/{b} 人", { a: party.members.length, b: party.maxMembers })}
          </span>
        </div>
        <span className="muted">
          🕐 <TimeText iso={party.scheduledTime} />
        </span>
      </div>
      <div className="muted" style={{ marginTop: 6, fontSize: 12 }}>
        📍 {party.location} · 👤 {t("发起人")} {party.host?.name}
      </div>
    </Link>
  );
}
