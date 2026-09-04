import { NextRequest } from "next/server";
import { ensureReady } from "@/lib/db";
import { getSid, getCurrentUser, ok } from "@/lib/server";

/** 对应原版自动登录：Web 版以浏览器会话（sid）识别身份，未注册时 user 为 null */
export async function GET(req: NextRequest) {
  await ensureReady();
  const sid = getSid(req);
  const user = await getCurrentUser(sid);
  return ok({ user, sid });
}
