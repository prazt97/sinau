"use client";
import { FormEvent, useState } from "react";
export default function PaymentForm() {
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("proof") as File;
    const upload = new FormData();
    upload.set("file", file);
    const uploadResult = await fetch("/api/uploads/payment-proof", {
      method: "POST",
      body: upload,
    }).then((r) => r.json());
    if (!uploadResult.success) return setMessage(uploadResult.message);
    form.set("proofUrl", uploadResult.data.url);
    form.delete("proof");
    const payment = await fetch("/api/payments/confirmations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    }).then((r) => r.json());
    setMessage(payment.message);
  }
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Konfirmasi Pembayaran</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          name="courseId"
          required
          placeholder="ID course"
          className="rounded-lg border p-3"
        />
        <input
          name="voucherCode"
          placeholder="Kode voucher"
          className="rounded-lg border p-3"
        />
        <input
          name="paidAmount"
          type="number"
          required
          placeholder="Nominal bayar"
          className="rounded-lg border p-3"
        />
        <input
          name="paymentMethod"
          required
          placeholder="Metode pembayaran"
          className="rounded-lg border p-3"
        />
        <input
          name="payerName"
          required
          placeholder="Nama pengirim"
          className="rounded-lg border p-3"
        />
        <input
          name="transferDate"
          type="date"
          required
          className="rounded-lg border p-3"
        />
        <input
          name="proof"
          type="file"
          accept="image/*"
          required
          className="rounded-lg border p-3"
        />
        <button className="rounded-xl bg-blue-600 p-3 text-white">
          Kirim Konfirmasi
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
