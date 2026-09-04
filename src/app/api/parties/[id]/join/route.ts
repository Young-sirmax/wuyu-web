import { NextRequest } from "next/server";
import { sql, ensureReady, rowsToParties } from "@/lib/db";
import { getSid, getCurrentUser, ok, fail } from "@/lib/server";

/** 加入组局（对应原版 joinParty 云函数） */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureReady();
  const { id } = await params;
  const sid = getSid(req);
  const me = await getCurrentUser(sid);
  if (!me) return fail("请先注册或完善资料后再加入组局", 403, "NEED_REGISTER");

  const rows = await sql`SELECT * FROM wy_parties WHERE _id = ${id}`;
  if (!rows.length) return fail("组局不存在", 404);
  const p = rows[0];
  if (p.status !== "recruiting") return fail("该组局当前不可加入");
  const members = p.members || [];
  if (members.length >= p.max_members) return fail("该组局人数已满");
  if (members.some((m: any) => m.openid === sid)) return fail("你已加入该组局");

  const meMember = {
    openid: me.openid,
    name: me.name,
    avatar: me.avatar || "",
    role: me.role,
    isHost: false,
  };
  members.push(meMember);
  const status = members.length >= p.max_members ? "full" : "recruiting";
  await sql`
    UPDATE wy_parties SET members = ${sql.json(members)}, status = ${status} WHERE _id = ${id}`;

  const updated = await sql`SELECT * FROM wy_parties WHERE _id = ${id}`;
  return ok({ party: rowsToParties(updated)[0] });
}
