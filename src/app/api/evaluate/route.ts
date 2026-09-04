import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { getSid, getCurrentUser, ok, fail, nowIso, recomputeRating, updateCredit } from "@/lib/server";
import { EVALUATION_DIMENSIONS } from "@/lib/constants";

/** 提交互评（对应原版 submitEvaluation）：写评价、更新对方评分与信用分、练习次数 +1 */
export async function POST(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  const me = await getCurrentUser(sid);
  if (!me) return fail("请先注册或完善资料", 403, "NEED_REGISTER");

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return fail("请求参数错误");
  }

  const targetOpenid = String(body.targetOpenid || "");
  const appointmentId = String(body.appointmentId || "");
  const comment = String(body.comment || "").trim().slice(0, 200);
  const dims: any = body.dimensions || {};

  if (!targetOpenid || targetOpenid === sid) return fail("被评价对象无效");
  const targetRows = await sql`SELECT * FROM wy_users WHERE openid = ${targetOpenid}`;
  if (!targetRows.length) return fail("被评价的用户不存在", 404);

  for (const d of EVALUATION_DIMENSIONS) {
    const v = Number(dims[d.key]);
    if (!Number.isInteger(v) || v < 1 || v > 5) return fail(`请为「${d.label}」打分（1-5 星）`);
  }

  const _id = `e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  await sql`
    INSERT INTO wy_evaluations (_id, owner_openid, owner_name, owner_avatar, target_openid, target_name, target_avatar, appointment_id, dimensions, comment, create_time)
    VALUES (${_id}, ${sid}, ${me.name}, ${me.avatar || ""}, ${targetOpenid}, ${targetRows[0].name}, ${targetRows[0].avatar || ""}, ${appointmentId}, ${sql.json(dims)}, ${comment}, ${nowIso()})`;

  const avg = await recomputeRating(targetOpenid);
  await updateCredit(targetOpenid, 1);
  await sql`UPDATE wy_users SET practice_count = practice_count + 1 WHERE openid = ${sid}`;
  await sql`UPDATE wy_appointments SET is_evaluated = true WHERE openid = ${sid} AND _id = ${appointmentId}`;

  return ok({
    evaluationId: _id,
    target: { openid: targetOpenid, name: targetRows[0].name, avatar: targetRows[0].avatar, ratingAvg: avg },
  });
}
