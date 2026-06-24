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
  if (!session || session.role !== "creator")
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const course = await prisma.course.findFirst({
    where: { id, creatorId: session.id, status: "draft" },
    include: { modules: { include: { lessons: true } } },
  });
  if (!course)
    return NextResponse.json(
      {
        success: false,
        message: "Course draft tidak ditemukan",
        error_code: "NOT_FOUND",
      },
      { status: 404 },
    );
  if (
    !course.modules.length ||
    !course.modules.some((module) => module.lessons.length)
  )
    return NextResponse.json(
      {
        success: false,
        message: "Course membutuhkan module dan lesson",
        error_code: "CONTENT_REQUIRED",
      },
      { status: 400 },
    );
  const updated = await prisma.course.update({
    where: { id },
    data: { status: "review" },
  });
  return NextResponse.json({
    success: true,
    message: "Course dikirim untuk review",
    data: updated,
  });
}
