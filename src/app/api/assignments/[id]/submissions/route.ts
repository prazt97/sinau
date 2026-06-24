import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const { id } = await params;
  const body = await request.json();
  if (!session || session.role !== "learner")
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const assignment = await prisma.assignments.findUnique({ where: { id } });
  const enrollment = assignment
    ? await prisma.enrollments.findFirst({
        where: {
          learner_id: session.id,
          course_id: assignment.course_id,
          status: { in: ["active", "completed"] },
        },
      })
    : null;
  if (!assignment || !enrollment)
    return NextResponse.json(
      { success: false, message: "Akses ditolak", error_code: "ACCESS_DENIED" },
      { status: 403 },
    );
  const submission = await prisma.assignment_submissions.create({
    data: {
      assignment_id: id,
      learner_id: session.id,
      enrollment_id: enrollment.id,
      submission_text: body.text,
      submission_link: body.link,
      submission_file_url: body.fileUrl,
    },
  });
  return NextResponse.json(
    { success: true, message: "Tugas dikirim", data: submission },
    { status: 201 },
  );
}
