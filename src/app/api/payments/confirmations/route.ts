import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function POST(request: NextRequest) {
  try {
    const session = await readSession(
      (await cookies()).get(sessionCookie)?.value,
    );
    if (!session || session.role !== "learner")
      return NextResponse.json(
        { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
        { status: 401 },
      );
    const body = await request.json();
    const price = await prisma.coursePrice.findFirst({
      where: { courseId: body.courseId, isActive: true },
      orderBy: { createdAt: "desc" },
    });
    if (!price || !body.payerName || !body.paymentMethod || !body.transferDate)
      return NextResponse.json(
        {
          success: false,
          message: "Data pembayaran tidak valid",
          error_code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    let discount = 0;
    let voucherId: string | null = null;
    if (body.voucherCode) {
      const voucher = await prisma.vouchers.findUnique({
        where: { code: body.voucherCode },
      });
      const now = new Date();
      if (
        !voucher ||
        !voucher.is_active ||
        (voucher.course_id && voucher.course_id !== body.courseId) ||
        (voucher.valid_until && voucher.valid_until < now)
      )
        return NextResponse.json(
          {
            success: false,
            message: "Voucher tidak valid",
            error_code: "INVALID_VOUCHER",
          },
          { status: 400 },
        );
      voucherId = voucher.id;
      discount =
        voucher.discount_type === "percentage"
          ? (Number(price.regularPrice) * Number(voucher.discount_value)) / 100
          : Number(voucher.discount_value);
    }
    const finalAmount = Math.max(0, Number(price.regularPrice) - discount);
    const payment = await prisma.payment_confirmations.create({
      data: {
        learner_id: session.id,
        course_id: body.courseId,
        voucher_id: voucherId,
        course_price: price.regularPrice,
        discount_amount: discount,
        final_amount: finalAmount,
        paid_amount: body.paidAmount,
        payment_method: body.paymentMethod,
        payer_name: body.payerName,
        transfer_date: new Date(body.transferDate),
        proof_url: body.proofUrl,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "Konfirmasi pembayaran dikirim",
        data: payment,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim pembayaran",
        error_code: "CREATE_PAYMENT_FAILED",
      },
      { status: 400 },
    );
  }
}
