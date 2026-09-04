import { NextRequest } from "next/server";
import { sql, ensureReady, rowsToParties } from "@/lib/db";
import { ok, fail } from "@/lib/server";

/** 组局详情 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await ensureReady();
  const { id } = await params;
  const rows = await sql`SELECT * FROM wy_parties WHERE _id = ${id}`;
  if (!rows.length) return fail("组局不存在", 404);
  return ok({ party: rowsToParties(rows)[0] });
}
