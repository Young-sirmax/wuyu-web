import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { getSid, getCurrentUser, ok, fail, nowIso, recomputeRating } from "@/lib/server";
import { LANGUAGES, SCHOOLS } from "@/lib/constants";
import type { UserRole, LangCode, SchoolCode } from "@/lib/types";

/** 对应原版云函数 register：注册 / 完善个人资料（openid 即会话 sid） */
export async function POST(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  if (!sid) return fail("会话已失效，请刷新页面重试", 401);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return fail("请求参数错误");
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const studentId = String(body.studentId || "").trim();
  const role = body.role as UserRole;
  const nativeLang = body.nativeLang as LangCode;
  const learnLangs: LangCode[] = Array.isArray(body.learnLangs) ? body.learnLangs : [];
  const school = (body.school || "current") as SchoolCode;
  const bio = String(body.bio || "").trim();

  if (name.length < 2 || name.length > 20) return fail("昵称长度需为 2-20 个字符");
  if (!/^1\d{10}$/.test(phone)) return fail("请输入正确的手机号");
  if (studentId.length < 3 || studentId.length > 20) return fail("请输入正确的学号");
  if (!["chinese", "international"].includes(role)) return fail("请选择身份");
  if (!LANGUAGES.some((l) => l.code === nativeLang)) return fail("请选择母语");
  const validLangs = learnLangs.filter((c) => LANGUAGES.some((l) => l.code === c));
  if (!validLangs.length) return fail("请至少选择一种想练习的语言");
  if (!SCHOOLS.some((s) => s.code === school)) return fail("请选择学校");

  const schoolName = SCHOOLS.find((s) => s.code === school)!.name;
  const existing = await sql`SELECT openid FROM wy_users WHERE openid = ${sid}`;
  const isNew = !existing.length;
  const avatar = body.avatar ? String(body.avatar) : "";

  await sql`
    INSERT INTO wy_users (openid, name, phone, student_id, school, school_name, role, avatar, native_lang, learn_langs, bio, credit_score, practice_count, rating_avg, is_online, create_time)
    VALUES (${sid}, ${name}, ${phone}, ${studentId}, ${school}, ${schoolName}, ${role}, ${avatar}, ${nativeLang}, ${sql.json(validLangs)}, ${bio}, ${validLangs.length ? 85 : 80}, 0, 0, true, ${nowIso()})
    ON CONFLICT (openid) DO UPDATE SET
      name = EXCLUDED.name, phone = EXCLUDED.phone, student_id = EXCLUDED.student_id,
      school = EXCLUDED.school, school_name = EXCLUDED.school_name, role = EXCLUDED.role,
      avatar = EXCLUDED.avatar, native_lang = EXCLUDED.native_lang, learn_langs = EXCLUDED.learn_langs,
      bio = EXCLUDED.bio`;

  // 不做任何新手演示数据注入；仅存量用户资料更新后重算评分
  if (!isNew) {
    await recomputeRating(sid);
  }

  const user = await getCurrentUser(sid);
  return ok({ user, isNew });
}
