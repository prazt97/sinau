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
  const { body } = await request.json();
  if (!session || !body)
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const discussion = await prisma.discussions.findUnique({ where: { id } });
  const assigned =
    session.role === "tutor" && discussion
      ? await prisma.tutor_assignments.findFirst({
          where: {
            tutor_id: session.id,
            course_id: discussion.course_id,
            is_active: true,
          },
        })
      : null;
  if (
    session.role !== "admin" &&
    !assigned &&
    discussion?.learner_id !== session.id
  )
    return NextResponse.json(
      { success: false, message: "Akses ditolak", error_code: "ACCESS_DENIED" },
      { status: 403 },
    );
  const reply = await prisma.discussion_replies.create({
    data: {
      discussion_id: id,
      user_id: session.id,
      body,
      is_tutor_answer: !!assigned,
    },
  });
  return NextResponse.json(
    { success: true, message: "Balasan dikirim", data: reply },
    { status: 201 },
  );
}
