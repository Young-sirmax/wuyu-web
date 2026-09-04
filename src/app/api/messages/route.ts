import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { getSid, ok, fail } from "@/lib/server";

/** 消息列表（对应原版 getMessages，查询归属当前会话的消息） */
export async function GET(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  if (!sid) return ok([]);
  const rows = await sql`
    SELECT * FROM wy_messages WHERE openid = ${sid} ORDER BY create_time DESC LIMIT 50`;
  return ok(
    rows.map((r) => ({
      _id: r._id,
      type: r.type,
      title: r.title,
      content: r.content,
      isRead: !!r.is_read,
      createTime: r.create_time,
      extra: r.extra || undefined,
    }))
  );
}

/** 标记消息已读 */
export async function PATCH(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  if (!sid) return fail("会话已失效", 401);
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return fail("请求参数错误");
  }
  const { id } = body;
  if (!id) return fail("缺少消息 id");
  await sql`UPDATE wy_messages SET is_read = true WHERE _id = ${id} AND openid = ${sid}`;
  return ok({ id, isRead: true });
}
