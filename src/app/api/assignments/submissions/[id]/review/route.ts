import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const reviewer = await readSession(
      (await cookies()).get(sessionCookie)?.value,
    );
    const { id } = await params;
    const { score, feedback } = await request.json();
    if (!reviewer || !["admin", "tutor"].includes(reviewer.role))
      throw new Error("UNAUTHORIZED");
    const existing = await prisma.assignment_submissions.findUnique({
      where: { id },
      include: { assignments: true },
    });
    const assigned =
      reviewer.role === "tutor" && existing
        ? await prisma.tutor_assignments.findFirst({
            where: {
              tutor_id: reviewer.id,
              course_id: existing.assignments.course_id,
              is_active: true,
            },
          })
        : true;
    if (!existing || !assigned) throw new Error("ACCESS_DENIED");
    const submission = await prisma.assignment_submissions.update({
      where: { id },
      data: {
        score,
        feedback,
        status: "reviewed",
        reviewed_by: reviewer.id,
        reviewed_at: new Date(),
      },
    });
    return NextResponse.json({
      success: true,
      message: "Tugas direview",
      data: submission,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal review tugas",
        error_code: "REVIEW_FAILED",
      },
      { status: 400 },
    );
  }
}
