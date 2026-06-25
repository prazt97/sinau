"use client";
import { FormEvent, useState } from "react";
import { PaymentPricingMenu } from "@/components/payment-pricing-menu";
export default function PaymentForm() {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage("");
    const form = new FormData(e.currentTarget);
    const file = form.get("proof") as File;
    const upload = new FormData();
    upload.set("file", file);
    const uploadResult = await fetch("/api/uploads/payment-proof", {
      method: "POST",
      body: upload,
    }).then((r) => r.json());
    if (!uploadResult.success) {
      setIsPending(false);
      return setMessage(uploadResult.message);
    }
    form.set("proofUrl", uploadResult.data.url);
    form.delete("proof");
    const payment = await fetch("/api/payments/confirmations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    }).then((r) => r.json());
    setMessage(payment.message);
    setIsPending(false);
    if (payment.success) e.currentTarget.reset();
  }
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Konfirmasi Pembayaran</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pembayaran dilakukan di luar sistem Sinau. Setelah transfer, unggah
          bukti pembayaran agar admin dapat memverifikasi dan membuka akses
          course Anda.
        </p>
      </div>

      <div className="mt-5">
        <PaymentPricingMenu role="learner" />
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <label className="grid gap-1 text-sm font-medium">
          ID course <span className="text-red-600">*</span>
          <input
            name="courseId"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Kode voucher
          <input
            name="voucherCode"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Nominal bayar <span className="text-red-600">*</span>
          <input
            name="paidAmount"
            type="number"
            required
            min="0"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">
            Metode pembayaran <span className="text-red-600">*</span>
            <input
              name="paymentMethod"
              required
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Nama pengirim <span className="text-red-600">*</span>
            <input
              name="payerName"
              required
              className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </label>
        </div>
        <label className="grid gap-1 text-sm font-medium">
          Tanggal transfer <span className="text-red-600">*</span>
          <input
            name="transferDate"
            type="date"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Upload bukti pembayaran <span className="text-red-600">*</span>
          <input
            name="proof"
            type="file"
            accept="image/*"
            required
            className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <button
          disabled={isPending}
          className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Mengirim..." : "Kirim Konfirmasi"}
        </button>
        {message && (
          <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
