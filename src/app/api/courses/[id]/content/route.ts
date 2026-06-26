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

const nullableText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const cleanSortOrder = (value: unknown) => {
  const sortOrder = Number.parseInt(String(value ?? "0"), 10);
  return Number.isNaN(sortOrder) ? 0 : sortOrder;
};

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
  const title = cleanText(body.title);
  const sortOrder = cleanSortOrder(body.sortOrder);

  if (body.type === "module" && title) {
    const courseModule = await prisma.module.create({
      data: {
        courseId: id,
        title,
        description: nullableText(body.description),
        sortOrder,
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
        description: nullableText(body.description),
        lessonType: body.lessonType ?? "text",
        content: nullableText(body.content),
        sortOrder,
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

export async function PATCH(
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
  const title = cleanText(body.title);
  const sortOrder = cleanSortOrder(body.sortOrder);

  try {
    if (body.type === "course" && title && cleanText(body.slug)) {
      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          title,
          slug: cleanText(body.slug),
          level: nullableText(body.level),
          shortDescription: nullableText(body.shortDescription),
          description: nullableText(body.description),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Course diperbarui",
        data: updatedCourse,
      });
    }

    if (body.type === "module" && body.moduleId && title) {
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

      const updatedModule = await prisma.module.update({
        where: { id: body.moduleId },
        data: {
          title,
          description: nullableText(body.description),
          sortOrder,
        },
        include: { lessons: true },
      });

      return NextResponse.json({
        success: true,
        message: "Module diperbarui",
        data: updatedModule,
      });
    }

    if (body.type === "lesson" && body.lessonId && body.moduleId && title) {
      const [lesson, courseModule] = await Promise.all([
        prisma.lesson.findFirst({
          where: { id: body.lessonId, modules: { courseId: id } },
        }),
        prisma.module.findFirst({
          where: { id: body.moduleId, courseId: id },
        }),
      ]);

      if (!lesson || !courseModule)
        return NextResponse.json(
          {
            success: false,
            message: "Lesson atau module tidak ditemukan untuk course ini",
            error_code: "LESSON_OR_MODULE_NOT_FOUND",
          },
          { status: 404 },
        );

      const updatedLesson = await prisma.lesson.update({
        where: { id: body.lessonId },
        data: {
          moduleId: body.moduleId,
          title,
          description: nullableText(body.description),
          lessonType: body.lessonType ?? "text",
          content: nullableText(body.content),
          sortOrder,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Lesson diperbarui",
        data: updatedLesson,
      });
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui konten",
        error_code: "UPDATE_CONTENT_FAILED",
      },
      { status: 400 },
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
