import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "cp_uid";

export function proxy(request: NextRequest) {
  if (request.cookies.has(COOKIE)) return NextResponse.next();

  const uid = crypto.randomUUID();
  // Expose to this same request's server code, and persist for later ones.
  request.cookies.set(COOKIE, uid);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(COOKIE, uid, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
