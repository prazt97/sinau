import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function POST(request: NextRequest) {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session || !["creator", "admin"].includes(session.role))
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const { title, slug, shortDescription, description, level } =
    await request.json();
  if (!title || !slug)
    return NextResponse.json(
      {
        success: false,
        message: "Judul dan slug wajib diisi",
        error_code: "VALIDATION_ERROR",
      },
      { status: 400 },
    );
  const course = await prisma.course.create({
    data: {
      title,
      slug,
      shortDescription,
      description,
      level,
      creatorId: session.id,
      learningOutcomes: [],
      requirements: [],
    },
  });
  return NextResponse.json(
    { success: true, message: "Course draft dibuat", data: course },
    { status: 201 },
  );
}
