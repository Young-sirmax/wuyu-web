"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, useAsyncData, partyApi, guardResult, toast, fmtDate, fmtTime } from "@/lib/client";
import { NavBar, Avatar, Stars, LangTag, StatusTag, Empty, SkeletonList } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Party } from "@/lib/types";

/** 组局详情 */
export default function PartyDetail({ id }: { id: string }) {
  const { user } = useSession();
  const t = useT();
  const detail = useAsyncData(async () => {
    const res = await partyApi.detail(id);
    if (res.ok) return res.data?.party ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, [id]);
  const [joining, setJoining] = useState(false);

  const party: Party | null = detail.data;
  const joined = !!party && !!user && party.members.some((m) => m.openid === user.openid);

  async function onJoin() {
    if (joining) return;
    setJoining(true);
    const res = await partyApi.join(id);
    const r = await guardResult(res);
    setJoining(false);
    if (!r) return;
    detail.setData((r.data as any).party);
    toast(t("加入成功，记得按时赴约！"), "success");
  }

  if (detail.loading) {
    return (
      <>
        <NavBar title={t("组局详情")} />
        <div className="shell">
          <SkeletonList count={3} />
        </div>
      </>
    );
  }

  if (!party) {
    return (
      <>
        <NavBar title={t("组局详情")} />
        <div className="shell">
          <Empty icon="🤔" text={t("组局不存在或已被删除")} />
        </div>
      </>
    );
  }

  const dt = party.scheduledTime ? new Date(party.scheduledTime) : null;
  const canJoin = party.status === "recruiting" && !joined && party.members.length < party.maxMembers;

  return (
    <>
      <NavBar title={t("组局详情")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        <div className="card pop-in">
          <div className="row-between">
            <h1 style={{ fontSize: 20, fontWeight: 800, flex: 1, marginRight: 8 }}>{party.title}</h1>
            <StatusTag status={party.status} />
          </div>
          {party.topic && (
            <p className="muted mt-6" style={{ fontSize: 14 }}>
              💬 {party.topic}
            </p>
          )}
          <div className="divider" />
          <div style={{ display: "grid", gap: 8 }}>
            <div className="row" style={{ gap: 8 }}>
              <span>🗣️</span>
              <LangTag code={party.language} />
              <span className="tag tag-blue">🎓 {t(party.schoolName)}</span>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span>🕐</span>
              <span style={{ fontSize: 14 }}>
                {dt && !Number.isNaN(dt.getTime())
                  ? `${fmtDate(dt.toISOString())} ${fmtTime(dt.toISOString())}`
                  : t("待定")}
              </span>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span>📍</span>
              <span style={{ fontSize: 14 }}>{party.location}</span>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span>👥</span>
              <span style={{ fontSize: 14 }}>
                {t("{a} / {b} 人", { a: party.members.length, b: party.maxMembers })}
                {party.status === "recruiting"
                  ? t(" · 还差 {n} 人开练", { n: Math.max(0, party.maxMembers - party.members.length) })
                  : ""}
              </span>
            </div>
          </div>
        </div>

        {/* 操作区 */}
        {!user ? (
          <div className="card" style={{ padding: 14 }}>
            <p className="muted mb-6">{t("登录后即可加入组局")}</p>
            <Link href="/register" className="btn btn-primary btn-block">
              {t("先注册 / 完善资料")}
            </Link>
          </div>
        ) : joined ? (
          <div className="card centered" style={{ padding: 16 }}>
            <span className="tag tag-green" style={{ fontSize: 13, padding: "6px 16px" }}>
              ✅ {t("你已加入该组局")}
            </span>
            <p className="muted mt-6">{t("到时见！记得准时赴约，互评能让彼此进步更快")}</p>
          </div>
        ) : canJoin ? (
          <div className="card" style={{ padding: 14 }}>
            <button className="btn btn-primary btn-lg btn-block" disabled={joining} onClick={onJoin}>
              {joining ? t("加入中…") : t("加入组局")}
            </button>
          </div>
        ) : (
          <div className="card centered" style={{ padding: 16 }}>
            <span className="tag tag-gray" style={{ fontSize: 13, padding: "6px 16px" }}>
              {party.status === "full" ? t("该组局已满员") : t("该组局当前不可加入")}
            </span>
          </div>
        )}

        {/* 成员列表 */}
        <div className="section-head">
          <h2 className="section-title">👥 {t("组局成员")}</h2>
          <span className="muted">{t("{count} 人", { count: party.members.length })}</span>
        </div>
        <div className="card" style={{ padding: "6px 14px" }}>
          {party.members.map((m) => (
            <div key={m.openid} className="listitem">
              <Avatar src={m.avatar} name={m.name} size={40} />
              <div className="body">
                <div className="row" style={{ gap: 6 }}>
                  <span className="title">{m.name}</span>
                  {m.isHost && <span className="tag tag-orange">{t("发起人")}</span>}
                  <span className={`tag ${m.role === "international" ? "tag-purple" : "tag-blue"}`}>
                    {m.role === "international" ? t("留学生") : t("中国学生")}
                  </span>
                </div>
                {m.openid === user?.openid && <span className="sub">{t("我")}</span>}
              </div>
              <Link href={`/user-profile?openid=${m.openid}`} className="btn btn-ghost btn-sm">
                {t("主页")}
              </Link>
            </div>
          ))}
        </div>

        {party.status === "recruiting" && (
          <p className="muted" style={{ textAlign: "center", padding: "8px 0" }}>
            {t("信用分越高越容易被伙伴信任，按时赴约、真实互评可提升信用分")}
          </p>
        )}
      </div>
    </>
  );
}
