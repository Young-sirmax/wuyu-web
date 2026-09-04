"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, userApi, guardResult, toast, setUserState, fmtTime } from "@/lib/client";
import { NavBar, LangTag } from "@/components/ui";
import { LANGUAGES, SCHOOLS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { LangCode, UserRole } from "@/lib/types";

/** 注册 / 完善资料页 */
export default function RegisterPage() {
  const t = useT();
  return (
    <Suspense
      fallback={
        <div className="shell" style={{ padding: 40, textAlign: "center" }}>
          {t("加载中…")}
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useT();
  const { user } = useSession();
  const editing = !!user;

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [studentId, setStudentId] = useState(user?.studentId || "");
  const [role, setRole] = useState<UserRole>(user?.role || "chinese");
  const [school, setSchool] = useState<string>(user?.school || "current");
  const [nativeLang, setNativeLang] = useState<LangCode>(user?.nativeLang || "zh");
  const [learnLangs, setLearnLangs] = useState<LangCode[]>(user?.learnLangs || ["en"]);
  const [bio, setBio] = useState(user?.bio || "");
  const [submitting, setSubmitting] = useState(false);

  function toggleLearn(code: LangCode) {
    setLearnLangs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : prev.length >= 3 ? prev : [...prev, code]
    );
  }

  async function onSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const res = await userApi.register({ name, phone, studentId, role, school, nativeLang, learnLangs, bio });
    const r = await guardResult(res);
    setSubmitting(false);
    if (!r) return;
    const u = (r.data as { user: any }).user;
    setUserState({ user: u, loaded: true });
    toast(editing ? t("资料已更新") : t("注册成功，欢迎加入胡说！"), "success");
    router.push("/home");
  }

  return (
    <>
      <NavBar
        title={editing ? t("编辑资料") : t("注册")}
        back={false}
        right={<span className="muted">{params.get("from") ? "" : t("完善资料 +5 信用分")}</span>}
      />
      <div className="shell" style={{ paddingBottom: 40 }}>
        <div className="card centered" style={{ marginBottom: 12 }}>
          <div className="brand-logo" style={{ width: 56, height: 56, fontSize: 26 }}>
            说
          </div>
          <h2 style={{ marginTop: 10 }}>{editing ? t("完善你的资料") : t("欢迎加入胡说")}</h2>
          <p className="muted">{t("高校国际口语语伴与组局平台，找到语伴，开口说外语")}</p>
        </div>

        <div className="safe-hint">🔒 {t("手机号与学号仅用于平台内身份核验，不会公开展示。")}</div>

        <div className="card">
          <div className="field">
            <label className="field-label">{t("昵称（2-20 字）")}</label>
            <input
              className="input"
              value={name}
              maxLength={20}
              placeholder={t("请输入你的昵称")}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("手机号")}</label>
            <input
              className="input"
              value={phone}
              maxLength={11}
              inputMode="numeric"
              placeholder={t("请输入 11 位手机号")}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("学号")}</label>
            <input
              className="input"
              value={studentId}
              maxLength={20}
              placeholder={t("请输入学号")}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("身份")}</label>
            <div className="radio-row">
              <button type="button" className={`radio-pill${role === "chinese" ? " active" : ""}`} onClick={() => setRole("chinese")}>
                🎓 {t("中国学生")}
              </button>
              <button type="button" className={`radio-pill${role === "international" ? " active" : ""}`} onClick={() => setRole("international")}>
                🌏 {t("留学生")}
              </button>
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("学校")}</label>
            <div className="radio-row">
              {SCHOOLS.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  className={`radio-pill${school === s.code ? " active" : ""}`}
                  onClick={() => setSchool(s.code)}
                >
                  {t(s.name)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("母语")}</label>
            <div className="radio-row">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`radio-pill${nativeLang === l.code ? " active" : ""}`}
                  onClick={() => setNativeLang(l.code)}
                >
                  {l.flag} {t(l.name)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("想练习的语言（最多 3 门）")}</label>
            <div className="radio-row">
              {LANGUAGES.filter((l) => l.code !== nativeLang).map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`radio-pill${learnLangs.includes(l.code) ? " active" : ""}`}
                  onClick={() => toggleLearn(l.code)}
                >
                  {l.flag} {t(l.name)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("一句话介绍自己")}</label>
            <textarea
              className="input"
              value={bio}
              maxLength={100}
              placeholder={t("例如：英语口语爱好者，喜欢和各国同学交流")}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={submitting} onClick={onSubmit}>
            {submitting ? t("提交中…") : editing ? t("保存修改") : t("注册并开始找语伴")}
          </button>
          {editing && (
            <button className="btn btn-plain btn-block mt-6" onClick={() => router.push("/mine")}>
              {t("返回「我的」")}
            </button>
          )}
          <p className="muted" style={{ marginTop: 14, textAlign: "center" }}>
            {t("注册即代表同意平台公约：文明交流、按时赴约、真实互评")}
          </p>
        </div>
      </div>
    </>
  );
}
