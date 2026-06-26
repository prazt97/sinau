import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";

async function getSession() {
  return readSession((await cookies()).get(sessionCookie)?.value);
}

async function findEditableCourse(
  id: string,
  session: { id: string; role: string },
) {
  return prisma.course.findFirst({
    where: {
      id,
      ...(session.role === "creator" ? { creatorId: session.id } : {}),
    },
  });
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || !["creator", "admin"].includes(session.role))
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );

  const course = await findEditableCourse(id, session);

  if (!course)
    return NextResponse.json(
      {
        success: false,
        message: "Course tidak ditemukan",
        error_code: "NOT_FOUND",
      },
      { status: 404 },
    );

  const modules = await prisma.module.findMany({
    where: { courseId: id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      lessons: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  return NextResponse.json({
    success: true,
    message: "Konten course dimuat",
    data: { course, modules },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || !["creator", "admin"].includes(session.role))
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );

  const course = await findEditableCourse(id, session);

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
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const sortOrder = Number.parseInt(String(body.sortOrder ?? "0"), 10);

  if (body.type === "module" && title) {
    const courseModule = await prisma.module.create({
      data: {
        courseId: id,
        title,
        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : null,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      },
      include: { lessons: true },
    });
    return NextResponse.json(
      { success: true, message: "Module dibuat", data: courseModule },
      { status: 201 },
    );
  }

  if (body.type === "lesson" && body.moduleId && title) {
    const courseModule = await prisma.module.findFirst({
      where: { id: body.moduleId, courseId: id },
    });

    if (!courseModule)
      return NextResponse.json(
        {
          success: false,
          message: "Module tidak ditemukan untuk course ini",
          error_code: "MODULE_NOT_FOUND",
        },
        { status: 404 },
      );

    const lesson = await prisma.lesson.create({
      data: {
        moduleId: body.moduleId,
        title,
        description:
          typeof body.description === "string" && body.description.trim()
            ? body.description.trim()
            : null,
        lessonType: body.lessonType ?? "text",
        content:
          typeof body.content === "string" && body.content.trim()
            ? body.content.trim()
            : null,
        sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
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
