import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const courseId = request.nextUrl.searchParams.get("courseId") ?? undefined;
    const dateFrom = request.nextUrl.searchParams.get("from");
    const dateTo = request.nextUrl.searchParams.get("to");
    const date =
      dateFrom || dateTo
        ? {
            created_at: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          }
        : {};
    const course = courseId ? { course_id: courseId } : {};
    const [learners, courses, pending, approved, payments, enrollments] =
      await Promise.all([
        prisma.user.count({ where: { role: "learner" } }),
        prisma.course.count({ where: { status: "published" } }),
        prisma.payment_confirmations.count({
          where: { status: "pending", ...course, ...date },
        }),
        prisma.payment_confirmations.count({
          where: { status: "approved", ...course, ...date },
        }),
        prisma.payment_confirmations.findMany({
          where: { status: "approved", ...course, ...date },
          select: { paid_amount: true },
        }),
        prisma.enrollments.findMany({
          where: courseId ? { course_id: courseId } : {},
          select: { course_id: true, progress_percent: true },
        }),
      ]);
    const revenue = payments.reduce(
      (total, payment) => total + Number(payment.paid_amount),
      0,
    );
    return NextResponse.json({
      success: true,
      message: "OK",
      data: { learners, courses, pending, approved, revenue, enrollments },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }
}
