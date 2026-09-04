import { NextRequest } from "next/server";
import { sql, ensureReady, rowsToUsers, rowsToParties } from "@/lib/db";
import { getSid, ok } from "@/lib/server";

/** 对应原版 getDiscoverData：发现页聚合（推荐语伴 / 推荐组局 / 头马俱乐部 / 练习 Vlog） */
export async function GET(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);

  const partners = rowsToUsers(
    await sql`
      SELECT * FROM wy_users WHERE openid <> ${sid}
      ORDER BY rating_avg DESC, credit_score DESC LIMIT 6`
  );

  const partyRows = await sql`
    SELECT * FROM wy_parties WHERE status = 'recruiting'
    ORDER BY create_time DESC LIMIT 3`;
  const parties = rowsToParties(partyRows);

  const clubRows = await sql`SELECT * FROM wy_toastmasters_clubs LIMIT 1`;
  const club = clubRows[0]
    ? {
        _id: clubRows[0]._id,
        name: clubRows[0].name,
        school: clubRows[0].school,
        schoolName: clubRows[0].school_name,
        intro: clubRows[0].intro,
        meetingTime: clubRows[0].meeting_time,
        location: clubRows[0].location,
        memberCount: clubRows[0].member_count,
        cover: clubRows[0].cover,
        nextMeeting: clubRows[0].next_meeting,
      }
    : null;

  const vlogs = (
    await sql`SELECT * FROM wy_vlogs ORDER BY create_time DESC LIMIT 3`
  ).map((r) => ({
    _id: r._id,
    title: r.title,
    author: r.author,
    authorAvatar: r.author_avatar,
    cover: r.cover,
    duration: r.duration,
    plays: r.plays,
    createTime: r.create_time,
  }));

  return ok({ partners, parties, club, vlogs });
}
