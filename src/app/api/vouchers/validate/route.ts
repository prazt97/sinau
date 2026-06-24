import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const courseId = searchParams.get("courseId");
  const voucher = code
    ? await prisma.vouchers.findUnique({ where: { code } })
    : null;
  const now = new Date();
  const valid =
    voucher &&
    voucher.is_active &&
    (!voucher.course_id || voucher.course_id === courseId) &&
    (!voucher.valid_from || voucher.valid_from <= now) &&
    (!voucher.valid_until || voucher.valid_until >= now) &&
    (!voucher.usage_limit || voucher.usage_count < voucher.usage_limit);
  return valid
    ? NextResponse.json({
        success: true,
        message: "Voucher valid",
        data: voucher,
      })
    : NextResponse.json(
        {
          success: false,
          message: "Voucher tidak valid",
          error_code: "INVALID_VOUCHER",
        },
        { status: 400 },
      );
}
