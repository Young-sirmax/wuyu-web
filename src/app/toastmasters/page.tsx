"use client";

import { useAsyncData, contentApi, toast, fmtDate } from "@/lib/client";
import { NavBar, SkeletonList, Empty } from "@/components/ui";
import { useT } from "@/lib/i18n";

/** 头马演讲俱乐部 */
export default function ToastmastersPage() {
  const t = useT();
  const data = useAsyncData(async () => {
    const res = await contentApi.toastmasters();
    if (res.ok) return res.data ?? null;
    toast(t(res.error || "加载失败"), "error");
    return null;
  }, []);

  const club = data.data?.[0];

  return (
    <>
      <NavBar title={t("头马演讲俱乐部")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        {data.loading ? (
          <SkeletonList count={3} />
        ) : !club ? (
          <Empty icon="🎤" text={t("暂无俱乐部信息")} />
        ) : (
          <>
            <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 14, boxShadow: "var(--shadow)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={club.cover} alt={club.name} style={{ width: "100%", height: 180, objectFit: "cover" }} referrerPolicy="no-referrer" />
            </div>

            <div className="card pop-in">
              <h1 style={{ fontSize: 20, fontWeight: 800 }}>🎤 {club.name}</h1>
              <p className="muted mt-6">{club.intro}</p>
              <div className="divider" />
              <div style={{ display: "grid", gap: 8 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span>🏫</span>
                  <span style={{ fontSize: 14 }}>{t(club.schoolName)}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span>🗓️</span>
                  <span style={{ fontSize: 14 }}>{club.meetingTime}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span>📍</span>
                  <span style={{ fontSize: 14 }}>{club.location}</span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <span>👥</span>
                  <span style={{ fontSize: 14 }}>{t("{count} 位成员", { count: club.memberCount })}</span>
                </div>
                {club.nextMeeting && (
                  <div className="row" style={{ gap: 8 }}>
                    <span>⏰</span>
                    <span style={{ fontSize: 14 }}>
                      {t("下次例会")}：<b>{fmtDate(club.nextMeeting)}</b>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="safe-hint" style={{ marginTop: 4 }}>
              💡 {t("头马（Toastmasters International）是全球性非营利演讲组织，例会含即兴演讲、备稿演讲与互评反馈，欢迎现场观摩后加入。")}
            </div>
          </>
        )}
      </div>
    </>
  );
}
