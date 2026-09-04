"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, useAsyncData, userApi, evaluateApi, guardResult, toast } from "@/lib/client";
import { NavBar, Avatar, Empty, SkeletonList } from "@/components/ui";
import { EVALUATION_DIMENSIONS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { User } from "@/lib/types";

export default function EvaluationPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const targetOpenid = params.get("targetOpenid") || "";
  const appointmentId = params.get("appointmentId") || "";
  const qName = params.get("targetName") || "";
  const { user: me } = useSession();

  const target = useAsyncData(async () => {
    if (!targetOpenid) return null;
    const res = await userApi.getPublicUser(targetOpenid);
    if (res.ok && res.data) return res.data.user;
    return null;
  }, [targetOpenid]);

  const [dims, setDims] = useState<Record<string, number>>({ civility: 5, friendliness: 5, punctuality: 5, language: 5 });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!me) {
      toast(t("请先注册"), "info");
      router.push("/register");
      return;
    }
    if (!targetOpenid) return toast(t("被评价对象无效"), "error");
    if (submitting) return;
    setSubmitting(true);
    const res = await evaluateApi.submit({ targetOpenid, appointmentId, dimensions: dims, comment });
    const r = await guardResult(res);
    setSubmitting(false);
    if (!r) return;
    toast(t("互评提交成功，已为对方更新评分"), "success");
    router.push("/mine");
  }

  const u: User | null = target.data ?? (targetOpenid ? ({ name: qName, avatar: "" } as User) : null);

  return (
    <>
      <NavBar title={t("口语互评")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        <div className="safe-hint">{t("⭐ 互评有助于平台推荐更合适的语伴，请客观真实打分。")}</div>

        {target.loading ? (
          <SkeletonList count={2} />
        ) : !u ? (
          <Empty icon="🙈" text={t("未找到可评价的用户")} />
        ) : (
          <>
            {/* 被评对象 */}
            <section className="card row" style={{ gap: 12 }}>
              <Avatar src={u.avatar} name={u.name} size={52} />
              <div className="flex-1">
                <div style={{ fontSize: 16, fontWeight: 700 }}>{u.name}</div>
                <div className="muted mt-6">
                  {u.schoolName || t("本校")} · {u.role === "international" ? t("留学生") : t("中国学生")}
                  {u.ratingAvg ? ` · ${u.ratingAvg.toFixed(1)} ${t("分")}` : ""}
                </div>
              </div>
              <Link href={`/user-profile?openid=${targetOpenid}`} className="btn btn-ghost btn-sm">
                {t("主页")}
              </Link>
            </section>

            {/* 维度打分 */}
            <section className="card">
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>{t("为 Ta 的本次练习打分")}</h3>
              {EVALUATION_DIMENSIONS.map((d) => (
                <div key={d.key} className="row-between" style={{ padding: "9px 0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {d.icon} {t(d.label)}
                    </div>
                    <div className="muted">{t(d.hint)}</div>
                  </div>
                  <StarPicker value={dims[d.key]} onChange={(v) => setDims((prev) => ({ ...prev, [d.key]: v }))} />
                </div>
              ))}
            </section>

            {/* 文字评价 */}
            <section className="card">
              <label className="field-label">{t("写点评价（选填，最多 200 字）")}</label>
              <textarea
                className="input"
                value={comment}
                maxLength={200}
                placeholder={t("例如：交流很顺畅，发音地道，还给我分享了学习方法～")}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="muted" style={{ textAlign: "right", marginTop: 4 }}>
                {comment.length}/200
              </div>
              <button className="btn btn-primary btn-lg btn-block" disabled={submitting} onClick={onSubmit}>
                {submitting ? t("提交中…") : t("提交互评")}
              </button>
              <p className="muted" style={{ textAlign: "center", marginTop: 10 }}>
                {t("提交后将同步更新对方信用分与综合评分")}
              </p>
            </section>
          </>
        )}
      </div>
    </>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const t = useT();
  return (
    <div className="row" style={{ gap: 3 }} role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          aria-label={t("{n} 星", { n })}
          style={{ fontSize: 24, color: n <= value ? "#ffb03a" : "#e4e6eb", transition: "transform .1s", padding: 0 }}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
