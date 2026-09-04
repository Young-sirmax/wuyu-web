import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { sql, toUser, ensureReady, rowsToParties } from "@/lib/db";
import type { User } from "@/lib/types";

/** 会话标识（sid）即用户 openid 的等价物 */
export function getSid(req: NextRequest): string {
  return req.cookies.get(SESSION_COOKIE)?.value || "";
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** 读取当前会话对应用户（未注册返回 null） */
export async function getCurrentUser(sid: string): Promise<User | null> {
  if (!sid) return null;
  const rows = await sql`SELECT * FROM wy_users WHERE openid = ${sid}`;
  if (!rows.length) return null;
  return toUser(rows[0]);
}

/** 统一响应体 */
export function ok<T>(data: T): NextResponse {
  return NextResponse.json({ ok: true, data });
}

export function fail(message: string, status = 400, code?: string): NextResponse {
  return NextResponse.json({ ok: false, error: message, code }, { status });
}

/** 从云端 party 行转为可安全下发 JSON 的 Party */
export async function partyRowsToJson(rows: any[]) {
  const parties = rowsToParties(rows);
  // 补充动态成员数
  return parties.map((p: any) => ({ ...p }));
}

export { ensureReady };

/** 依据收到的评价重算某用户的综合评分（维度均值 → 总体均值） */
export async function recomputeRating(openid: string) {
  const evs = await sql`SELECT dimensions FROM wy_evaluations WHERE target_openid = ${openid}`;
  if (!evs.length) {
    await sql`UPDATE wy_users SET rating_avg = 0 WHERE openid = ${openid}`;
    return 0;
  }
  const sum = evs.reduce(
    (acc, r) => {
      const d = r.dimensions || {};
      return {
        civility: acc.civility + (Number(d.civility) || 0),
        friendliness: acc.friendliness + (Number(d.friendliness) || 0),
        punctuality: acc.punctuality + (Number(d.punctuality) || 0),
        language: acc.language + (Number(d.language) || 0),
      };
    },
    { civility: 0, friendliness: 0, punctuality: 0, language: 0 }
  );
  const n = evs.length;
  const avg =
    (sum.civility + sum.friendliness + sum.punctuality + sum.language) / 4 / n;
  const rounded = Math.round(avg * 10) / 10;
  await sql`UPDATE wy_users SET rating_avg = ${rounded} WHERE openid = ${openid}`;
  return rounded;
}

/** 更新某用户的信用分（沿用原版公式：+1 上限 100，最低 -5） */
export async function updateCredit(targetOpenid: string, delta: number) {
  await sql`
    UPDATE wy_users SET credit_score = LEAST(100, GREATEST(0, credit_score + ${delta}))
    WHERE openid = ${targetOpenid}`;
}
