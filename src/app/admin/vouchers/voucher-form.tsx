"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CourseOption = {
  id: string;
  title: string;
};

export function VoucherForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function createVoucher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("code") ?? "")
      .trim()
      .toUpperCase();
    const discountValue = Number(formData.get("discountValue") ?? 0);

    if (!/^[A-Z0-9]{7}$/.test(code)) {
      setMessage("ID voucher wajib 7 karakter huruf/angka.");
      return;
    }

    if (discountValue <= 0 || discountValue > 100) {
      setMessage("Discount wajib antara 1 sampai 100%.");
      return;
    }

    setIsPending(true);

    const usageLimit = String(formData.get("usageLimit") ?? "").trim();
    const validUntil = String(formData.get("validUntil") ?? "").trim();

    const response = await fetch("/api/admin/vouchers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        name: formData.get("name"),
        description: formData.get("description"),
        discountType: "percentage",
        discountValue,
        courseId: formData.get("courseId"),
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        validUntil: validUntil || undefined,
      }),
    });
    const result = (await response.json()) as { message: string };

    setMessage(result.message);
    setIsPending(false);

    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={createVoucher}
      className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div>
        <h2 className="text-base font-semibold">Create Discount Voucher</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Buat voucher percentage untuk course tertentu.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          ID voucher <span className="text-red-600">*</span>
          <input
            name="code"
            required
            maxLength={7}
            pattern="[A-Za-z0-9]{7}"
            placeholder="ABC1234"
            className="uppercase rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Nama voucher <span className="text-red-600">*</span>
          <input
            name="name"
            required
            placeholder="Diskon Launching"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium">
        Course <span className="text-red-600">*</span>
        <select
          name="courseId"
          required
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        >
          <option value="">Pilih course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium">
          Discount (%) <span className="text-red-600">*</span>
          <input
            name="discountValue"
            type="number"
            min="1"
            max="100"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Batas penggunaan
          <input
            name="usageLimit"
            type="number"
            min="0"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Berlaku sampai
          <input
            name="validUntil"
            type="date"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium">
        Deskripsi
        <textarea
          name="description"
          className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>

      <button
        disabled={isPending || courses.length === 0}
        className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Create Voucher"}
      </button>

      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}
