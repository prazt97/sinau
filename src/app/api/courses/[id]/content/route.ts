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
  if (!session || !["creator", "admin"].includes(session.role))
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
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
  const body = await request.json();
  if (body.type === "module" && body.title) {
    const courseModule = await prisma.module.create({
      data: {
        courseId: id,
        title: body.title,
        description: body.description,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(
      { success: true, message: "Module dibuat", data: courseModule },
      { status: 201 },
    );
  }
  if (body.type === "lesson" && body.moduleId && body.title) {
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: body.moduleId,
        title: body.title,
        lessonType: body.lessonType ?? "text",
        content: body.content,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(
      { success: true, message: "Lesson dibuat", data: lesson },
      { status: 201 },
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "Data konten tidak valid",
      error_code: "VALIDATION_ERROR",
    },
    { status: 400 },
  );
}
