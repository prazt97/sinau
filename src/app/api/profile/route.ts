import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

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

    const { fullName, phone, avatarUrl } = await request.json();
    if (!fullName || String(fullName).trim().length < 2)
      return NextResponse.json(
        {
          success: false,
          message: "Nama lengkap tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );

    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        fullName: String(fullName).trim(),
        phone: phone ? String(phone).trim() : null,
        avatarUrl: avatarUrl ? String(avatarUrl).trim() : null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        status: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile berhasil diperbarui",
      data: user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui profile",
        error_code: "UPDATE_PROFILE_FAILED",
      },
      { status: 400 },
    );
  }
}
