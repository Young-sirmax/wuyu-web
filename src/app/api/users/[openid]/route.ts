import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { ok, fail } from "@/lib/server";

/** 用户公开信息（不含手机号/学号），附带其收到的评价分维度均值，供语伴卡/主页/互评页使用 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ openid: string }> }) {
  await ensureReady();
  const { openid } = await params;
  const rows = await sql`SELECT * FROM wy_users WHERE openid = ${openid}`;
  if (!rows.length) return fail("用户不存在", 404);
  const r = rows[0];

  const evs = await sql`SELECT dimensions FROM wy_evaluations WHERE target_openid = ${openid}`;
  const dimKeys = ["civility", "friendliness", "punctuality", "language"] as const;
  const ratingSummary = { civility: 0, friendliness: 0, punctuality: 0, language: 0 };
  if (evs.length) {
    for (const key of dimKeys) {
      const sum = evs.reduce((acc, e) => acc + (Number((e.dimensions || {})[key]) || 0), 0);
      ratingSummary[key] = Math.round((sum / evs.length) * 10) / 10;
    }
  }

  return ok({
    user: {
      openid: r.openid,
      name: r.name,
      schoolName: r.school_name,
      role: r.role,
      avatar: r.avatar || "",
      nativeLang: r.native_lang,
      learnLangs: r.learn_langs || [],
      bio: r.bio || "",
      creditScore: r.credit_score,
      practiceCount: r.practice_count,
      ratingAvg: Number(r.rating_avg || 0),
      isOnline: !!r.is_online,
      createTime: r.create_time,
    },
    ratingSummary,
    evaluationCount: evs.length,
  });
}
