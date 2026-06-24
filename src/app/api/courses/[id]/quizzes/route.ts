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
  if (!session || !["creator", "admin"].includes(session.role) || !body.title)
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized atau data tidak valid",
        error_code: "VALIDATION_ERROR",
      },
      { status: 400 },
    );
  const course = await prisma.course.findFirst({
    where: {
      id,
      ...(session.role === "creator" ? { creatorId: session.id } : {}),
    },
  });
  if (!course)
    return NextResponse.json(
      {
        success: false,
        message: "Course tidak ditemukan",
        error_code: "NOT_FOUND",
      },
      { status: 404 },
    );
  const quiz = await prisma.quizzes.create({
    data: {
      course_id: id,
      module_id: body.moduleId,
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json(
    { success: true, message: "Quiz dibuat", data: quiz },
    { status: 201 },
  );
}
