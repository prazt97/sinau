import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
const roles = ["learner", "creator", "tutor", "admin"];
const statuses = ["active", "inactive", "suspended"];
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const data: {
      fullName?: string;
      role?: "learner" | "creator" | "tutor" | "admin";
      status?: "active" | "inactive" | "suspended";
    } = {};
    if (typeof body.fullName === "string" && body.fullName.trim())
      data.fullName = body.fullName.trim();
    if (roles.includes(body.role)) data.role = body.role;
    if (statuses.includes(body.status)) data.status = body.status;
    if (!Object.keys(data).length)
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const user = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({
      success: true,
      message: "User berhasil diperbarui",
      data: user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui user",
        error_code: "UPDATE_USER_FAILED",
      },
      { status: 400 },
    );
  }
}
