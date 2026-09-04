"use client";

import Link from "next/link";
import { useAsyncData, contentApi, toast, fmtDate } from "@/lib/client";
import { NavBar, Empty, SkeletonList } from "@/components/ui";
import { useT } from "@/lib/i18n";
import type { Vlog } from "@/lib/types";

/** 练习 Vlog 详情（对应原版 vlog 页：口语练习视频与作者信息） */
export default function VlogBody({ id }: { id: string }) {
  const t = useT();
  const data = useAsyncData(async () => {
    const res = await contentApi.vlogs();
    if (res.ok) return res.data?.vlogs ?? [];
    toast(t(res.error || "加载失败"), "error");
    return [];
  }, []);

  const vlogs: Vlog[] = data.data || [];
  const vlog = vlogs.find((v) => v._id === id) || vlogs[0];

  if (data.loading) {
    return (
      <>
        <NavBar title={t("口语 Vlog")} />
        <div className="shell">
          <SkeletonList count={2} />
        </div>
      </>
    );
  }

  if (!vlog) {
    return (
      <>
        <NavBar title={t("口语 Vlog")} />
        <div className="shell">
          <Empty icon="🎬" text={t("暂无 Vlog 内容")} />
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar title={t("口语 Vlog")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        {/* 封面（占位播放器） */}
        <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow)", marginBottom: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vlog.cover} alt={vlog.title} style={{ width: "100%", height: 220, objectFit: "cover" }} referrerPolicy="no-referrer" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,.32)",
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "#1f2329",
                paddingLeft: 6,
              }}
            >
              ▶
            </span>
          </div>
          <span className="tag" style={{ position: "absolute", right: 8, bottom: 8, background: "rgba(0,0,0,.55)", color: "#fff" }}>
            {vlog.duration}
          </span>
        </div>

        <h1 style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.4 }}>{vlog.title}</h1>

        <div className="card row mt-6" style={{ gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vlog.authorAvatar}
            alt={vlog.author}
            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
          <div className="flex-1">
            <b style={{ fontSize: 14 }}>{vlog.author}</b>
            <div className="muted">{t("{author} 的口语练习日常", { author: vlog.author })}</div>
          </div>
          <span className="muted">
            {t("发布于")} {fmtDate(vlog.createTime)}
          </span>
        </div>

        <div className="safe-hint">
          👀 {t("口语 Vlog 由语伴们发布，记录每一次开口练习，一起开口，一起进步")}
        </div>

        {/* 更多 Vlog */}
        <div className="section-head">
          <h2 className="section-title">🎬 {t("更多 Vlog")}</h2>
        </div>
        <div className="grid-2" style={{ display: "grid", gap: 12 }}>
          {vlogs
            .filter((v) => v._id !== vlog._id)
            .map((v) => (
              <Link key={v._id} href={`/vlog?id=${v._id}`} className="card row" style={{ gap: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.cover} alt={v.title} style={{ width: 72, height: 56, borderRadius: 10, objectFit: "cover" }} referrerPolicy="no-referrer" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {v.title}
                  </div>
                  <div className="muted mt-6">
                    {v.author} · 👀 {v.plays}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}
