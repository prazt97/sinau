import { NextResponse } from "next/server";
import { randomBytes, scryptSync } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({
      success: true,
      message: "OK",
      data: await prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }
}
export async function POST(request: Request) {
  try {
    await requireAdmin();
    const {
      email,
      fullName,
      password,
      role = "learner",
    } = await request.json();
    if (
      !email ||
      !fullName ||
      !password ||
      !["learner", "creator", "tutor", "admin"].includes(role)
    )
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const salt = randomBytes(16).toString("hex");
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
    const user = await prisma.user.create({
      data: { email, fullName, passwordHash, role },
    });
    return NextResponse.json(
      { success: true, message: "User berhasil dibuat", data: user },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat user",
        error_code: "CREATE_USER_FAILED",
      },
      { status: 400 },
    );
  }
}
