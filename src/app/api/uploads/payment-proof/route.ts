import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { cookies } from "next/headers";
import { readSession, sessionCookie } from "@/lib/auth/session";
export async function POST(request: NextRequest) {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session || session.role !== "learner")
    return NextResponse.json(
      { success: false, message: "Unauthorized", error_code: "UNAUTHORIZED" },
      { status: 401 },
    );
  const file = (await request.formData()).get("file");
  if (
    !(file instanceof File) ||
    file.size > 10 * 1024 * 1024 ||
    !file.type.startsWith("image/")
  )
    return NextResponse.json(
      {
        success: false,
        message: "File bukti harus gambar maksimal 10MB",
        error_code: "INVALID_FILE",
      },
      { status: 400 },
    );
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const data = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string }>((resolve, reject) =>
    cloudinary.uploader
      .upload_stream(
        {
          folder: `sinau/payment-proofs/${session.id}`,
          resource_type: "image",
        },
        (error, upload) => (error || !upload ? reject(error) : resolve(upload)),
      )
      .end(data),
  );
  return NextResponse.json({
    success: true,
    message: "Bukti pembayaran diupload",
    data: { url: result.secure_url },
  });
}
