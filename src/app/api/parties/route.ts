import { NextRequest } from "next/server";
import { sql, ensureReady, rowsToParties } from "@/lib/db";
import { getSid, getCurrentUser, ok, fail, nowIso } from "@/lib/server";
import { LANGUAGES, SCHOOLS } from "@/lib/constants";
import type { LangCode, SchoolCode } from "@/lib/types";

/** 组局列表：GET ?scope=mine 查看我参与的；POST 发起组局（对应原版 createParty） */
export async function GET(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope");

  if (scope === "mine") {
    if (!sid) return ok([]);
    const rows = await sql`
      SELECT * FROM wy_parties
      WHERE members @> ${sql.json([{ openid: sid }])}
      ORDER BY create_time DESC`;
    return ok(rowsToParties(rows));
  }

  const status = searchParams.get("status");
  const rows = status
    ? await sql`SELECT * FROM wy_parties WHERE status = ${status} ORDER BY create_time DESC`
    : await sql`SELECT * FROM wy_parties ORDER BY create_time DESC`;
  return ok(rowsToParties(rows));
}

export async function POST(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  const me = await getCurrentUser(sid);
  if (!me) return fail("请先注册或完善资料后再发起组局", 403, "NEED_REGISTER");

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return fail("请求参数错误");
  }

  const title = String(body.title || "").trim();
  const topic = String(body.topic || "").trim();
  const language = body.language as LangCode;
  const school = (body.school || "current") as SchoolCode;
  const scheduledTime = String(body.scheduledTime || "").trim();
  const location = String(body.location || "").trim();
  const maxMembers = Math.min(8, Math.max(2, Number(body.maxMembers) || 3));

  if (!title || title.length > 30) return fail("请输入 30 字以内的组局标题");
  if (!LANGUAGES.some((l) => l.code === language)) return fail("请选择练习语言");
  if (!SCHOOLS.some((s) => s.code === school)) return fail("请选择学校");
  if (!scheduledTime) return fail("请选择开始时间");
  if (!location || location.length > 30) return fail("请输入 30 字以内的地点");

  const schoolName = SCHOOLS.find((s) => s.code === school)!.name;
  const _id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const meMember = {
    openid: me.openid,
    name: me.name,
    avatar: me.avatar || "",
    role: me.role,
    isHost: true,
  };

  await sql`
    INSERT INTO wy_parties (_id, owner_openid, title, topic, language, school, school_name, host, members, max_members, status, scheduled_time, location, create_time)
    VALUES (${_id}, ${sid}, ${title}, ${topic}, ${language}, ${school}, ${schoolName}, ${sql.json(meMember)}, ${sql.json([meMember])}, ${maxMembers}, 'recruiting', ${scheduledTime}, ${location}, ${nowIso()})`;

  const rows = await sql`SELECT * FROM wy_parties WHERE _id = ${_id}`;
  return ok({ party: rowsToParties(rows)[0] });
}
