import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * 会话标识（sid）Cookie：等价于原小程序中微信登录返回的 openid。
 * 首次访问自动签发，后续所有 API 以该标识读写用户/消息/评价等个人数据。
 */
export function middleware(req: NextRequest) {
  const hasSid = req.cookies.has(SESSION_COOKIE);
  if (hasSid) {
    return NextResponse.next();
  }
  const res = NextResponse.next();
  res.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 年
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp)).*)"],
};
