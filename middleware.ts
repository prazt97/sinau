import { NextRequest, NextResponse } from "next/server";
import { readSession, sessionCookie } from "@/lib/auth/session";

const protectedPaths = ["/admin", "/learner", "/creator", "/tutor"];
export async function middleware(request: NextRequest) {
  if (!protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)))
    return NextResponse.next();
  const session = await readSession(request.cookies.get(sessionCookie)?.value);
  if (!session)
    return NextResponse.redirect(new URL("/auth/login", request.url));
  if (!request.nextUrl.pathname.startsWith(`/${session.role}`))
    return NextResponse.redirect(
      new URL(`/${session.role}/dashboard`, request.url),
    );
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/learner/:path*",
    "/creator/:path*",
    "/tutor/:path*",
  ],
};
