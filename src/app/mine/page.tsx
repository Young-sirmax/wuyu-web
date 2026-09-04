"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSession, useAsyncData, userApi, partyApi, toast, fmtRelative } from "@/lib/client";
import { TabBar, Avatar, Stars, SkeletonList, Empty, RatingBlock, LangTag, TimeText } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { MyProfile, Party } from "@/lib/types";

export default function MinePage() {
  const t = useT();
  const { user, loaded } = useSession();
  const me = useMemo(() => user, [user]);
  const [showMyParties, setShowMyParties] = useState(true);

  const profile = useAsyncData(async () => {
    const res = await userApi.profile();
    if (res.ok) return res.data ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, [me?.openid]);

  const myParties = useAsyncData(async () => {
    const res = await partyApi.list("mine");
    if (res.ok) return res.data ?? [];
    return [] as Party[];
  }, [me?.openid]);

  if (!loaded) {
    return (
      <div className="shell tab-page">
        <SkeletonList count={5} />
        <TabBar />
      </div>
    );
  }

  if (!me) {
    return (
      <div className="shell tab-page">
        <header className="brand-header">
          <div className="hello">
            {t("我的")}
            <small>{t("登录后查看资料与数据")}</small>
          </div>
          <span className="brand-logo">说</span>
        </header>
        <div className="card centered" style={{ padding: "40px 20px" }}>
          <Avatar name={t("游客")} size={72} />
          <h2 style={{ margin: "12px 0 4px" }}>{t("还未注册")}</h2>
          <p className="muted">{t("注册后可发起或加入组局、接收消息、参与互评")}</p>
          <Link href="/register" className="btn btn-primary btn-lg mt-12">
            {t("立即注册")}
          </Link>
        </div>
        <TabBar />
      </div>
    );
  }

  const p: MyProfile | null = profile.data ?? null;
  const stats = p?.stats;

  return (
    <div className="shell tab-page">
      <header className="brand-header">
        <div className="hello">
          {t("我的")}
          <small>{t("信用与成长，开口可见")}</small>
        </div>
        <Link href="/register" className="btn btn-plain btn-sm">
          ✏️ {t("编辑资料")}
        </Link>
      </header>

      {/* 用户卡 */}
      <section
        className="card pop-in row"
        style={{ gap: 14, background: "linear-gradient(135deg,#fff7f4,#fff)", border: "1px solid #ffe3d9" }}
      >
        <Avatar src={me.avatar} name={me.name} size={62} online />
        <div className="flex-1">
          <div className="row" style={{ gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{me.name}</span>
            <span className={`tag ${me.role === "international" ? "tag-purple" : "tag-blue"}`}>
              {me.role === "international" ? "🌏 " + t("留学生") : "🎓 " + t("中国学生")}
            </span>
          </div>
          <div className="muted mt-6" style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <LangTag code={me.nativeLang} />
            <span>
              💎 {t("信用分")} <b style={{ color: "var(--primary-strong)" }}>{me.creditScore}</b>
            </span>
          </div>
          <div className="muted" style={{ marginTop: 6 }}>
            {t(me.schoolName)} · {me.bio || t("这个人很懒，还没有简介")}
          </div>
        </div>
      </section>

      {/* 指标 */}
      <section className="card row" style={{ padding: "8px 4px", justifyContent: "space-around" }}>
        {[
          { label: t("综合评分"), value: me.ratingAvg ? me.ratingAvg.toFixed(1) : "—", extra: <Stars value={me.ratingAvg} size={11} /> },
          { label: t("练习次数"), value: String(me.practiceCount), extra: null },
          { label: t("我的组局"), value: String(stats?.partyCount ?? 0), extra: null },
          { label: t("收到好评"), value: String(stats?.evaluationCount ?? 0), extra: null },
        ].map((m) => (
          <div key={m.label} className="metric-pill">
            <b>{m.value}</b>
            {m.extra}
            <span>{m.label}</span>
          </div>
        ))}
      </section>

      {/* 评分维度 */}
      {p && stats && <RatingBlock avg={me.ratingAvg} dimensions={stats.ratingSummary} />}

      {/* 功能入口 */}
      <section className="card" style={{ padding: "6px 14px" }}>
        {[
          { icon: "🎉", text: t("发起 / 加入组局"), href: "/party", extra: t("我参与了 {count} 局", { count: stats?.partyCount ?? 0 }) },
          { icon: "📅", text: t("练习记录"), href: "/message", extra: t("{count} 次已完成", { count: stats?.appointmentCount ?? 0 }) },
          { icon: "🎤", text: t("头马演讲俱乐部"), href: "/toastmasters", extra: t("每周三晚例会") },
          { icon: "🎬", text: t("口语练习 Vlog"), href: "/vlog", extra: t("看语伴怎么练") },
        ].map((it) => (
          <Link key={it.text} href={it.href} className="listitem">
            <span style={{ fontSize: 22, width: 30, textAlign: "center" }}>{it.icon}</span>
            <span className="body">
              <span className="title">{it.text}</span>
              <span className="sub">{it.extra}</span>
            </span>
            <span className="chev">›</span>
          </Link>
        ))}
      </section>

      {/* 近期收到的互评 / 我的组局 */}
      <section className="section">
        <div className="section-head">
          <h2 className="section-title">⭐ {t("近期互评")}</h2>
          <button className="more-link" onClick={() => setShowMyParties((v) => !v)}>
            {showMyParties ? `${t("查看我的组局")} ›` : `${t("返回评价")} ›`}
          </button>
        </div>
        {showMyParties ? (
          myParties.loading ? (
            <SkeletonList count={2} />
          ) : (myParties.data || []).length === 0 ? (
            <Empty icon="🎉" text={t("暂无组局记录，去「组局」页看看吧")} />
          ) : (
            (myParties.data || [])
              .slice(0, 5)
              .map((party: Party) => (
                <Link
                  key={party._id}
                  href={`/party-detail?id=${party._id}`}
                  className="card"
                  style={{ display: "block" }}
                >
                  <div className="row-between">
                    <span className="title">{party.title}</span>
                    <span
                      className={`tag ${
                        party.status === "recruiting"
                          ? "tag-green"
                          : party.status === "full"
                            ? "tag-red"
                            : party.status === "ongoing"
                              ? "tag-blue"
                              : "tag-gray"
                      }`}
                    >
                      {party.status === "recruiting"
                        ? t("招募中")
                        : party.status === "full"
                          ? t("已满员")
                          : party.status === "ongoing"
                            ? t("进行中")
                            : t("已结束")}
                    </span>
                  </div>
                  <div className="muted mt-6">
                    <LangTag code={party.language} /> · <TimeText iso={party.scheduledTime} /> ·{" "}
                    {t("{a}/{b} 人", { a: party.members.length, b: party.maxMembers })}
                  </div>
                </Link>
              ))
          )
        ) : (p?.recentEvaluations || []).length === 0 ? (
          <Empty icon="⭐" text={t("还没有收到互评，多参与练习吧")} />
        ) : (
          p?.recentEvaluations.map((e) => (
            <div key={e._id} className="card row" style={{ gap: 10 }}>
              <Avatar src={e.evaluatorAvatar} name={e.evaluatorName} size={36} />
              <div className="flex-1">
                <div className="row-between">
                  <b style={{ fontSize: 14 }}>{e.evaluatorName}</b>
                  <Stars
                    value={
                      (e.dimensions.civility +
                        e.dimensions.friendliness +
                        e.dimensions.punctuality +
                        e.dimensions.language) /
                      4
                    }
                  />
                </div>
                <p className="muted" style={{ marginTop: 3 }}>
                  {e.comment || t("（未填写文字评价）")}
                </p>
              </div>
              <span className="muted" style={{ alignSelf: "flex-start" }}>
                {fmtRelative(e.createTime, t)}
              </span>
            </div>
          ))
        )}
      </section>

      <TabBar />
    </div>
  );
}
