import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function POST(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const { id } = await params;
  if (!session || session.role !== "learner")
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { modules: true },
  });
  const enrollment = lesson
    ? await prisma.enrollments.findFirst({
        where: {
          learner_id: session.id,
          course_id: lesson.modules.courseId,
          status: { in: ["active", "completed"] },
        },
      })
    : null;
  if (!lesson || !enrollment)
    return NextResponse.json(
      { success: false, message: "Akses ditolak", error_code: "ACCESS_DENIED" },
      { status: 403 },
    );
  await prisma.lesson_progress.upsert({
    where: {
      enrollment_id_lesson_id: { enrollment_id: enrollment.id, lesson_id: id },
    },
    create: {
      enrollment_id: enrollment.id,
      lesson_id: id,
      status: "completed",
      completed_at: new Date(),
    },
    update: { status: "completed", completed_at: new Date() },
  });
  const total = await prisma.lesson.count({
    where: {
      modules: { courseId: lesson.modules.courseId },
      isPublished: true,
    },
  });
  const completed = await prisma.lesson_progress.count({
    where: { enrollment_id: enrollment.id, status: "completed" },
  });
  const percent = total ? (completed / total) * 100 : 0;
  await prisma.enrollments.update({
    where: { id: enrollment.id },
    data: {
      progress_percent: percent,
      ...(percent === 100
        ? { status: "completed", completed_at: new Date() }
        : {}),
    },
  });
  return NextResponse.json({
    success: true,
    message: "Progress diperbarui",
    data: { progressPercent: percent },
  });
}
