"use client";

import Link from "next/link";
import { useSession, useAsyncData, userApi, toast } from "@/lib/client";
import { Avatar, TabBar, SkeletonList, Empty, LangTag, TimeText, StatusTag } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Party, User } from "@/lib/types";

export default function HomePage() {
  const { user, loaded } = useSession();
  const t = useT();
  const discover = useAsyncData(async () => {
    const res = await userApi.discover();
    if (res.ok) return res.data ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, []);

  const isLoading = !discover.data;

  return (
    <div className="shell tab-page">
      <header className="brand-header">
        <div className="hello">
          {user?.name
            ? t("你好，{name}", { name: user.name })
            : t("你好，{name}", { name: loaded ? t("同学") : "…" })}
          <small>{t("找到语伴 · 开口说外语")}</small>
        </div>
        <Link href="/mine" aria-label={t("我的")}>
          <Avatar src={user?.avatar} name={user?.name} size={44} online={!!user} />
        </Link>
      </header>

      {isLoading ? (
        <SkeletonList count={4} />
      ) : !discover.data ? (
        <Empty icon="😵" text={t("加载失败，请检查网络后刷新")} />
      ) : (
        <>
          <section className="card pop-in" style={{ background: "var(--grad)", color: "#fff", padding: 18 }}>
            <div style={{ fontSize: 19, fontWeight: 800 }}>{t("语言角 · 每周三晚")}</div>
            <div style={{ fontSize: 13, opacity: 0.92, margin: "4px 0 12px" }}>
              {t("头马演讲俱乐部 · 即兴演讲 · 互评反馈，等你来开口")}
            </div>
            <div className="row" style={{ gap: 10 }}>
              <Link
                href="/create-party"
                className="btn"
                style={{ background: "#fff", color: "var(--primary-strong)", padding: "8px 16px", fontSize: 13, fontWeight: 700 }}
              >
                ＋ {t("发起组局")}
              </Link>
              <Link
                href="/toastmasters"
                className="btn"
                style={{ background: "rgba(255,255,255,.22)", color: "#fff", padding: "8px 16px", fontSize: 13, fontWeight: 700 }}
              >
                {t("去看看")}
              </Link>
            </div>
          </section>

          <section className="section grid-2">
            <div className="section-head">
              <h2 className="section-title">👋 {t("推荐语伴")}</h2>
            </div>
            {discover.data.partners.length ? (
              <div className="hscroll">
                {discover.data.partners.map((p: User) => (
                  <PartnerCard key={p.openid} partner={p} />
                ))}
              </div>
            ) : (
              <Empty icon="👋" text={t("还没有语伴注册，成为第一个吧")} />
            )}
          </section>

          <section className="section grid-2">
            <div className="section-head">
              <h2 className="section-title">🎉 {t("热门组局")}</h2>
              <Link href="/party" className="more-link">
                {t("全部组局")} ›
              </Link>
            </div>
            {discover.data.parties.length ? (
              <div className="hscroll" style={{ flexDirection: "column" }}>
                {discover.data.parties.map((party: Party) => (
                  <PartyRow key={party._id} party={party} />
                ))}
              </div>
            ) : (
              <Empty icon="🤝" text={t("还没有组局，点击上方「发起组局」创建第一个")} />
            )}
          </section>

          {discover.data.club && (
            <section className="section">
              <div className="section-head">
                <h2 className="section-title">🎤 {t("头马演讲俱乐部")}</h2>
              </div>
              <Link href="/toastmasters" className="card row" style={{ gap: 12 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={discover.data.club.cover}
                  alt={t("头马俱乐部")}
                  style={{ width: 84, height: 84, borderRadius: 14, objectFit: "cover", flexShrink: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{discover.data.club.name}</div>
                  <div className="muted" style={{ margin: "3px 0" }}>
                    {discover.data.club.meetingTime} · {discover.data.club.location}
                  </div>
                  <div className="muted">{t("{count} 位成员已加入", { count: discover.data.club.memberCount })}</div>
                </div>
                <span style={{ color: "#c9cdd6" }}>›</span>
              </Link>
            </section>
          )}

          {discover.data.vlogs.length > 0 && (
            <section className="section">
              <div className="section-head">
                <h2 className="section-title">🎬 {t("口语练习 Vlog")}</h2>
              </div>
              <div className="hscroll">
                {discover.data.vlogs.map((v) => (
                  <Link
                    key={v._id}
                    href={`/vlog?id=${v._id}`}
                    className="card"
                    style={{ minWidth: 200, width: 200, padding: 0, overflow: "hidden" }}
                  >
                    <div style={{ position: "relative" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.cover}
                        alt={v.title}
                        style={{ width: "100%", height: 104, objectFit: "cover" }}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className="tag tag-gray"
                        style={{
                          position: "absolute",
                          right: 6,
                          bottom: 6,
                          background: "rgba(0,0,0,.55)",
                          color: "#fff",
                          border: "none",
                        }}
                      >
                        ▶ {v.duration}
                      </span>
                    </div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, height: 36, overflow: "hidden" }}>
                        {v.title}
                      </div>
                      <div className="muted mt-6" style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{v.author}</span>
                        <span>👀 {v.plays}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
      <TabBar />
    </div>
  );
}

/* 语伴卡片 */
function PartnerCard({ partner }: { partner: User }) {
  const t = useT();
  return (
    <Link
      href={`/user-profile?openid=${partner.openid}`}
      className="card"
      style={{ minWidth: 160, width: 160, padding: 12, flexShrink: 0 }}
    >
      <div className="row" style={{ gap: 8 }}>
        <Avatar src={partner.avatar} name={partner.name} size={40} online={partner.isOnline} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="title" style={{ fontSize: 14 }}>
            {partner.name}
          </div>
          <div className="muted" style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <span>{partner.role === "international" ? "🌏 " + t("留学生") : "🎓 " + t("中国学生")}</span>
          </div>
        </div>
      </div>
      <div className="row-between mt-6">
        <LangTag code={partner.nativeLang} />
        <span className="stars">{partner.ratingAvg.toFixed(1)}</span>
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 8, minHeight: 34 }}>
        {partner.bio ? partner.bio.slice(0, 26) : t("这个人很懒，还没写简介")}
        {partner.bio && partner.bio.length > 26 ? "…" : ""}
      </div>
    </Link>
  );
}

/* 组局行 */
function PartyRow({ party }: { party: Party }) {
  const t = useT();
  return (
    <Link href={`/party-detail?id=${party._id}`} className="card row" style={{ gap: 12, width: "100%" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row-between">
          <span className="title" style={{ fontSize: 15 }}>
            {party.title}
          </span>
          <StatusTag status={party.status} />
        </div>
        <div
          className="muted mt-6"
          style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          💬 {party.topic || t("自由交流")}
        </div>
        <div className="muted mt-6" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <LangTag code={party.language} />
            <span>·</span>
            <TimeText iso={party.scheduledTime} />
          </span>
          <span>
            👥 {party.members.length}/{party.maxMembers}
          </span>
        </div>
      </div>
      <div className="row" style={{ marginLeft: -4 }}>
        {party.members.slice(0, 3).map((m) => (
          <span key={m.openid} style={{ marginLeft: -8 }}>
            <Avatar src={m.avatar} name={m.name} size={30} />
          </span>
        ))}
      </div>
    </Link>
  );
}
