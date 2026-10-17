import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Gate only: signed-out page requests go to /login. Routing by user state lives in lib/career#nextStep. */
export function proxy(request: NextRequest) {
  if (request.cookies.has("cp_user")) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|api/graphql|_next/static|_next/image|favicon.ico).*)"],
};
