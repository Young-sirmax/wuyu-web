import { NextRequest } from "next/server";
import { sql, ensureReady } from "@/lib/db";
import { ok } from "@/lib/server";

/** 头马俱乐部列表 */
export async function GET(_req: NextRequest) {
  await ensureReady();
  const rows = await sql`SELECT * FROM wy_toastmasters_clubs`;
  return ok(
    rows.map((r) => ({
      _id: r._id,
      name: r.name,
      school: r.school,
      schoolName: r.school_name,
      intro: r.intro,
      meetingTime: r.meeting_time,
      location: r.location,
      memberCount: r.member_count,
      cover: r.cover,
      nextMeeting: r.next_meeting,
    }))
  );
}
