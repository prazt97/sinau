import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const { action, reviewNotes } = await request.json();
    const status =
      action === "publish"
        ? "published"
        : action === "archive"
          ? "archived"
          : action === "revision"
            ? "draft"
            : null;
    if (!status)
      return NextResponse.json(
        {
          success: false,
          message: "Aksi tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const course = await prisma.course.update({
      where: { id },
      data: {
        status,
        reviewedBy: admin.id,
        reviewNotes,
        ...(status === "published" ? { publishedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({
      success: true,
      message: "Status course diperbarui",
      data: course,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui course",
        error_code: "UPDATE_COURSE_FAILED",
      },
      { status: 400 },
    );
  }
}
