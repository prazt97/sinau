import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { course_prices: { where: { isActive: true }, take: 1 } },
  });
  return NextResponse.json({ success: true, message: "OK", data: courses });
}
