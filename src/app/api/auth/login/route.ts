import { scryptSync, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { createSession, sessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });
  const [salt, hash] = user?.passwordHash?.split(":") ?? [];
  const valid =
    salt &&
    hash &&
    timingSafeEqual(
      Buffer.from(hash, "hex"),
      scryptSync(password ?? "", salt, 64),
    );
  if (!valid || !user || user.status !== "active")
    return NextResponse.json(
      {
        success: false,
        message: "Email atau password tidak valid",
        error_code: "INVALID_CREDENTIALS",
      },
      { status: 401 },
    );
  const response = NextResponse.json({
    success: true,
    message: "Login berhasil",
    data: { role: user.role },
  });
  response.cookies.set(
    sessionCookie,
    await createSession({ id: user.id, role: user.role, email: user.email }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  );
  return response;
}
