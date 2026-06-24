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
    const { action, reason } = await request.json();
    if (action === "approve") {
      await prisma.$queryRaw`select * from approve_payment_and_create_enrollment(${id}::uuid, ${admin.id}::uuid)`;
      return NextResponse.json({
        success: true,
        message: "Pembayaran disetujui",
        data: {},
      });
    }
    if (action === "reject" && reason) {
      const payment = await prisma.payment_confirmations.update({
        where: { id },
        data: {
          status: "rejected",
          verified_by: admin.id,
          verified_at: new Date(),
          rejected_reason: reason,
        },
      });
      return NextResponse.json({
        success: true,
        message: "Pembayaran ditolak",
        data: payment,
      });
    }
    return NextResponse.json(
      {
        success: false,
        message: "Aksi tidak valid",
        error_code: "VALIDATION_ERROR",
      },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memverifikasi pembayaran",
        error_code: "VERIFY_PAYMENT_FAILED",
      },
      { status: 400 },
    );
  }
}
