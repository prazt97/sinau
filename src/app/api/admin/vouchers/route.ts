import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    if (
      !body.code ||
      !body.name ||
      !["percentage", "fixed"].includes(body.discountType) ||
      Number(body.discountValue) < 0
    )
      return NextResponse.json(
        {
          success: false,
          message: "Voucher tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const voucher = await prisma.vouchers.create({
      data: {
        code: body.code,
        name: body.name,
        discount_type: body.discountType,
        discount_value: body.discountValue,
        course_id: body.courseId,
        valid_from: body.validFrom ? new Date(body.validFrom) : null,
        valid_until: body.validUntil ? new Date(body.validUntil) : null,
        usage_limit: body.usageLimit,
        created_by: admin.id,
      },
    });
    return NextResponse.json(
      { success: true, message: "Voucher dibuat", data: voucher },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat voucher",
        error_code: "CREATE_VOUCHER_FAILED",
      },
      { status: 400 },
    );
  }
}
