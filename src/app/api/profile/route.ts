import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { getSid, getCurrentUser, ok } from "@/lib/server";

/** 对应原版 getMyProfile：我的资料 + 数据统计 + 近期收到的互评 */
export async function GET(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  const user = await getCurrentUser(sid);
  if (!user) {
    return ok({ user: null, stats: null, recentEvaluations: [] });
  }

  const received = await sql`SELECT dimensions FROM wy_evaluations WHERE target_openid = ${sid}`;
  const dimKeys = ["civility", "friendliness", "punctuality", "language"] as const;
  const ratingSummary = { civility: 0, friendliness: 0, punctuality: 0, language: 0 };
  if (received.length) {
    for (const key of dimKeys) {
      const sum = received.reduce((acc, r) => acc + (Number((r.dimensions || {})[key]) || 0), 0);
      ratingSummary[key] = Math.round((sum / received.length) * 10) / 10;
    }
  }

  const [appCountRows, partyCountRows, evalCountRows] = await Promise.all([
    sql`SELECT COUNT(*)::int AS c FROM wy_appointments WHERE openid = ${sid}`,
    sql`SELECT COUNT(*)::int AS c FROM wy_parties WHERE members @> ${sql.json([{ openid: sid }])}`,
    sql`SELECT COUNT(*)::int AS c FROM wy_evaluations WHERE target_openid = ${sid}`,
  ]);

  const recentRows = await sql`
    SELECT * FROM wy_evaluations WHERE target_openid = ${sid}
    ORDER BY create_time DESC LIMIT 3`;

  const recentEvaluations = recentRows.map((r) => ({
    _id: r._id,
    evaluatorName: r.owner_name || "",
    evaluatorAvatar: r.owner_avatar || "",
    dimensions: r.dimensions || {},
    comment: r.comment || "",
    createTime: r.create_time,
  }));

  return ok({
    user,
    stats: {
      ratingSummary,
      appointmentCount: appCountRows[0].c,
      partyCount: partyCountRows[0].c,
      evaluationCount: evalCountRows[0].c,
    },
    recentEvaluations,
  });
}
