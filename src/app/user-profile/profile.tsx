"use client";

import Link from "next/link";
import { useSession, useAsyncData, userApi, toast, fmtDate } from "@/lib/client";
import { NavBar, Avatar, RatingBlock, LangTag, Empty, SkeletonList } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { User } from "@/lib/types";

/** 用户主页（对应原版 user-profile 占位页，Web 版补齐为完整资料页） */
export default function Profile({ openid }: { openid: string }) {
  const t = useT();
  const { user: me } = useSession();
  const data = useAsyncData(async () => {
    const res = await userApi.getPublicUser(openid);
    if (res.ok) return res.data ?? null;
    toast(res.error || t("加载失败"), "error");
    return null;
  }, [openid]);

  if (data.loading) {
    return (
      <>
        <NavBar title={t("个人主页")} />
        <div className="shell">
          <SkeletonList count={3} />
        </div>
      </>
    );
  }

  const u: User | null = data.data?.user ?? null;
  if (!u) {
    return (
      <>
        <NavBar title={t("个人主页")} />
        <div className="shell">
          <Empty icon="🙈" text={t("该用户不存在")} />
        </div>
      </>
    );
  }

  const isMe = me?.openid === openid;
  const ratingSummary = data.data?.ratingSummary ?? null;

  return (
    <>
      <NavBar title={t("个人主页")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        {/* 用户卡 */}
        <section
          className="card pop-in"
          style={{
            background: `linear-gradient(135deg, ${u.role === "international" ? "#f5f0ff" : "#fff3ee"}, #fff)`,
            border: "1px solid var(--line)",
          }}
        >
          <div className="centered">
            <Avatar src={u.avatar} name={u.name} size={84} online={u.isOnline} />
            <h1 style={{ marginTop: 10, fontSize: 22 }}>{u.name}</h1>
            <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: "wrap", justifyContent: "center" }}>
              <span className={`tag ${u.role === "international" ? "tag-purple" : "tag-blue"}`}>
                {u.role === "international" ? `🌏 ${t("留学生")}` : `🎓 ${t("中国学生")}`}
              </span>
              <span className="tag tag-outline">🏫 {u.schoolName || t("本校")}</span>
              <span className="tag tag-gray">💎 {t("信用分")} {u.creditScore}</span>
            </div>
            <div className="row" style={{ gap: 8, marginTop: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-2)" }}>{t("母语：")}</span>
              <LangTag code={u.nativeLang} />
              {u.learnLangs.length > 0 && (
                <>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{t("正在练：")}</span>
                  {u.learnLangs.map((l) => (
                    <LangTag key={l} code={l} />
                  ))}
                </>
              )}
            </div>
            <p className="muted" style={{ marginTop: 12 }}>
              {u.bio || t("这个人很懒，还没有简介")}
            </p>
          </div>

          <div className="row" style={{ justifyContent: "center", gap: 14, marginTop: 14 }}>
            {[
              { label: t("综合评分"), value: u.ratingAvg ? u.ratingAvg.toFixed(1) : "—" },
              { label: t("练习次数"), value: String(u.practiceCount) },
              { label: t("收到好评"), value: String(data.data?.evaluationCount ?? 0) },
            ].map((s) => (
              <div key={s.label} className="metric-pill" style={{ padding: "6px 14px" }}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {!isMe && (
            <div className="row" style={{ gap: 10, marginTop: 14 }}>
              <Link href={`/evaluation?targetOpenid=${u.openid}&targetName=${encodeURIComponent(u.name)}`} className="btn btn-primary flex-1">
                ⭐ {t("我要互评")}
              </Link>
            </div>
          )}
        </section>

        {/* 评分维度 */}
        {ratingSummary && (
          <RatingBlock avg={u.ratingAvg} dimensions={ratingSummary} />
        )}

        <p className="muted" style={{ textAlign: "center", padding: "10px 0 4px" }}>
          {t("注册于")} {fmtDate(u.createTime)} · {t("平台信用体系保障每一次相遇")}
        </p>
      </div>
    </>
  );
}
