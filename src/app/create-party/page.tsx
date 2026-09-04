"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { partyApi, guardResult, toast } from "@/lib/client";
import { NavBar } from "@/components/ui";
import { LANGUAGES, SCHOOLS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { LangCode } from "@/lib/types";

/** 发起组局（对应原版创建组局页） */
export default function CreatePartyPage() {
  const router = useRouter();
  const t = useT();
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<LangCode>("en");
  const [school, setSchool] = useState("current");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [maxMembers, setMaxMembers] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!title.trim()) return toast(t("请填写组局标题"), "error");
    if (!location.trim()) return toast(t("请填写活动地点"), "error");
    if (!date || !time) return toast(t("请选择开始时间"), "error");
    if (submitting) return;
    setSubmitting(true);
    const res = await partyApi.create({
      title: title.trim(),
      topic: topic.trim(),
      language,
      school,
      scheduledTime: new Date(`${date}T${time}`).toISOString(),
      location: location.trim(),
      maxMembers,
    });
    const r = await guardResult(res);
    setSubmitting(false);
    if (!r) return;
    const partyId = (r.data as any).party._id;
    toast(t("组局发起成功，等待伙伴加入"), "success");
    router.push(`/party-detail?id=${partyId}`);
  }

  return (
    <>
      <NavBar title={t("发起组局")} />
      <div className="shell" style={{ paddingBottom: 40 }}>
        <div className="safe-hint">
          💡 {t("组局会展示在「发现-热门组局」与「组局-全部」中，其他人可直接申请加入。")}
        </div>
        <div className="card">
          <div className="field">
            <label className="field-label">{t("组局标题")} *</label>
            <input
              className="input"
              value={title}
              maxLength={30}
              placeholder={t("例如：周末英语角 · 自由话题")}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("讨论话题（选填）")}</label>
            <input
              className="input"
              value={topic}
              maxLength={60}
              placeholder={t("例如：聊聊你最近看的一部电影")}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("练习语言")} *</label>
            <div className="radio-row">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  className={`radio-pill${language === l.code ? " active" : ""}`}
                  onClick={() => setLanguage(l.code)}
                >
                  {l.flag} {t(l.name)}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("目标学校")}</label>
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
            <label className="field-label">{t("开始时间")} *</label>
            <div className="row" style={{ gap: 10 }}>
              <input type="date" className="input flex-1" value={date} onChange={(e) => setDate(e.target.value)} />
              <input type="time" className="input flex-1" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t("活动地点")} *</label>
            <input
              className="input"
              value={location}
              maxLength={30}
              placeholder={t("例如：图书馆三楼研讨室A")}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">{t("人数上限（2-8 人，默认 3 人小局）")}</label>
            <div className="radio-row">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`radio-pill${maxMembers === n ? " active" : ""}`}
                  onClick={() => setMaxMembers(n)}
                >
                  {t("{n} 人", { n })}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={submitting} onClick={onSubmit}>
            {submitting ? t("提交中…") : t("发布组局")}
          </button>
        </div>
      </div>
    </>
  );
}
