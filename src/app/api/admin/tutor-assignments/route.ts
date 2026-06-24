import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { tutorId, courseId } = await request.json();
    const assignment = await prisma.tutor_assignments.upsert({
      where: { tutor_id_course_id: { tutor_id: tutorId, course_id: courseId } },
      create: { tutor_id: tutorId, course_id: courseId, assigned_by: admin.id },
      update: { is_active: true, assigned_by: admin.id },
    });
    return NextResponse.json({
      success: true,
      message: "Tutor ditugaskan",
      data: assignment,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menugaskan tutor",
        error_code: "ASSIGN_TUTOR_FAILED",
      },
      { status: 400 },
    );
  }
}
