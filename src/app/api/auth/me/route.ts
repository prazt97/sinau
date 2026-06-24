import { NextRequest, NextResponse } from "next/server";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function GET(request: NextRequest) {
  const session = await readSession(request.cookies.get(sessionCookie)?.value);
  return session
    ? NextResponse.json({ success: true, message: "OK", data: session })
    : NextResponse.json(
        { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
        { status: 401 },
      );
}
