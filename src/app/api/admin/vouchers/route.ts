import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const code = String(body.code ?? "")
      .trim()
      .toUpperCase();
    const discountValue = Number(body.discountValue);
    const usageLimit =
      body.usageLimit === undefined ||
      body.usageLimit === null ||
      body.usageLimit === ""
        ? null
        : Number(body.usageLimit);

    if (
      !/^[A-Z0-9]{7}$/.test(code) ||
      !body.name ||
      body.discountType !== "percentage" ||
      discountValue <= 0 ||
      discountValue > 100 ||
      (usageLimit !== null && (!Number.isInteger(usageLimit) || usageLimit < 0))
    )
      return NextResponse.json(
        {
          success: false,
          message:
            "Voucher tidak valid. Kode wajib 7 huruf/angka dan discount 1-100%.",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );

    const voucher = await prisma.vouchers.create({
      data: {
        code,
        name: body.name,
        description: body.description,
        discount_type: "percentage",
        discount_value: discountValue,
        course_id: body.courseId || null,
        valid_from: body.validFrom ? new Date(body.validFrom) : null,
        valid_until: body.validUntil ? new Date(body.validUntil) : null,
        usage_limit: usageLimit,
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
