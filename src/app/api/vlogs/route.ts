import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { ok, fail } from "@/lib/server";

/** Vlog 列表 / 详情（?id=xxx） */
export async function GET(req: NextRequest) {
  await ensureReady();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const map = (r: any) => ({
    _id: r._id,
    title: r.title,
    author: r.author,
    authorAvatar: r.author_avatar,
    cover: r.cover,
    duration: r.duration,
    plays: r.plays,
    createTime: r.create_time,
  });
  if (id) {
    const rows = await sql`SELECT * FROM wy_vlogs WHERE _id = ${id}`;
    if (!rows.length) return fail("Vlog 不存在", 404);
    return ok({ vlog: map(rows[0]) });
  }
  const rows = await sql`SELECT * FROM wy_vlogs ORDER BY create_time DESC`;
  return ok({ vlogs: rows.map(map) });
}
