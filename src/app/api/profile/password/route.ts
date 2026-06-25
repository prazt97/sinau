import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

function verifyPassword(password: string, stored?: string | null) {
  const [salt, hash] = stored?.split(":") ?? [];
  if (!salt || !hash) return false;
  return timingSafeEqual(
    Buffer.from(hash, "hex"),
    scryptSync(password, salt, 64),
  );
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export async function PATCH(request: Request) {
  try {
    const session = await readSession(
      (await cookies()).get(sessionCookie)?.value,
    );
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
        { status: 401 },
      );

    const { currentPassword, newPassword, confirmPassword } =
      await request.json();
    if (!newPassword || String(newPassword).length < 8)
      return NextResponse.json(
        {
          success: false,
          message: "Password baru minimal 8 karakter",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    if (newPassword !== confirmPassword)
      return NextResponse.json(
        {
          success: false,
          message: "Konfirmasi password tidak sama",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user || !verifyPassword(currentPassword ?? "", user.passwordHash))
      return NextResponse.json(
        {
          success: false,
          message: "Password lama tidak valid",
          error_code: "INVALID_PASSWORD",
        },
        { status: 400 },
      );

    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash: hashPassword(newPassword) },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui",
      data: {},
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui password",
        error_code: "UPDATE_PASSWORD_FAILED",
      },
      { status: 400 },
    );
  }
}
