import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { courseId, regularPrice, promoPrice } = await request.json();
    if (
      !courseId ||
      Number(regularPrice) < 0 ||
      (promoPrice !== undefined && Number(promoPrice) < 0)
    )
      return NextResponse.json(
        {
          success: false,
          message: "Harga tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    const price = await prisma.$transaction(async (tx) => {
      await tx.coursePrice.updateMany({
        where: { courseId, isActive: true },
        data: { isActive: false },
      });

      return tx.coursePrice.create({
        data: { courseId, regularPrice, promoPrice, createdBy: admin.id },
      });
    });

    await prisma.audit_logs.create({
      data: {
        actor_id: admin.id,
        action: "set_course_price",
        entity_type: "course_prices",
        entity_id: price.id,
      },
    });
    return NextResponse.json(
      { success: true, message: "Harga berhasil disimpan", data: price },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan harga",
        error_code: "CREATE_PRICE_FAILED",
      },
      { status: 400 },
    );
  }
}
