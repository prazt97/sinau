import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth/session";
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
    data: {},
  });
  response.cookies.delete(sessionCookie);
  return response;
}
