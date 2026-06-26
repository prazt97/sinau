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
    const { action, reviewNotes, moduleId, lessonId } = await request.json();

    if (action === "delete-module") {
      const courseModule = await prisma.module.findFirst({
        where: { id: moduleId, courseId: id },
      });

      if (!courseModule)
        return NextResponse.json(
          {
            success: false,
            message: "Module tidak ditemukan",
            error_code: "MODULE_NOT_FOUND",
          },
          { status: 404 },
        );

      await prisma.module.delete({ where: { id: moduleId } });

      return NextResponse.json({
        success: true,
        message: "Module dihapus",
      });
    }

    if (action === "delete-lesson") {
      const lesson = await prisma.lesson.findFirst({
        where: { id: lessonId, modules: { courseId: id } },
      });

      if (!lesson)
        return NextResponse.json(
          {
            success: false,
            message: "Lesson tidak ditemukan",
            error_code: "LESSON_NOT_FOUND",
          },
          { status: 404 },
        );

      await prisma.lesson.delete({ where: { id: lessonId } });

      return NextResponse.json({
        success: true,
        message: "Lesson dihapus",
      });
    }

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

    if (action === "publish") {
      const courseForPublish = await prisma.course.findFirst({
        where: { id, status: "review" },
        include: { modules: { include: { lessons: true } } },
      });

      if (!courseForPublish)
        return NextResponse.json(
          {
            success: false,
            message: "Course review tidak ditemukan",
            error_code: "NOT_FOUND",
          },
          { status: 404 },
        );

      if (
        !courseForPublish.modules.length ||
        !courseForPublish.modules.some((module) => module.lessons.length)
      )
        return NextResponse.json(
          {
            success: false,
            message: "Course membutuhkan module dan lesson",
            error_code: "CONTENT_REQUIRED",
          },
          { status: 400 },
        );

      const course = await prisma.$transaction(async (tx) => {
        await tx.module.updateMany({
          where: { courseId: id },
          data: { isPublished: true },
        });
        await tx.lesson.updateMany({
          where: { modules: { courseId: id } },
          data: { isPublished: true },
        });

        return tx.course.update({
          where: { id },
          data: {
            status,
            reviewedBy: admin.id,
            reviewNotes,
            publishedAt: new Date(),
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Course dipublish ke katalog",
        data: course,
      });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        status,
        reviewedBy: admin.id,
        reviewNotes,
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
