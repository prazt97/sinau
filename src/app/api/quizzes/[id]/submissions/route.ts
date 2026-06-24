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
  const { answers } = await request.json();
  if (!session || session.role !== "learner")
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const quiz = await prisma.quizzes.findUnique({ where: { id } });
  const enrollment = quiz
    ? await prisma.enrollments.findFirst({
        where: {
          learner_id: session.id,
          course_id: quiz.course_id,
          status: { in: ["active", "completed"] },
        },
      })
    : null;
  if (!quiz || !enrollment)
    return NextResponse.json(
      { success: false, message: "Akses ditolak", error_code: "ACCESS_DENIED" },
      { status: 403 },
    );
  const submission = await prisma.quiz_submissions.create({
    data: {
      quiz_id: id,
      learner_id: session.id,
      enrollment_id: enrollment.id,
      answers,
    },
  });
  return NextResponse.json(
    { success: true, message: "Quiz dikirim", data: submission },
    { status: 201 },
  );
}
