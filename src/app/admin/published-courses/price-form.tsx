"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function PriceForm({
  courseId,
  regularPrice,
  promoPrice,
}: {
  courseId: string;
  regularPrice: number;
  promoPrice?: number | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const promoValue = String(formData.get("promoPrice") ?? "").trim();

    const response = await fetch("/api/admin/course-prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        regularPrice: Number(formData.get("regularPrice") ?? 0),
        promoPrice: promoValue ? Number(promoValue) : undefined,
      }),
    });
    const result = (await response.json()) as { message: string };

    setMessage(result.message);
    setIsPending(false);

    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={savePrice} className="mt-4 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Harga regular <span className="text-red-600">*</span>
          <input
            name="regularPrice"
            type="number"
            min="0"
            required
            defaultValue={regularPrice}
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Harga promo
          <input
            name="promoPrice"
            type="number"
            min="0"
            defaultValue={promoPrice ?? ""}
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
      </div>
      <button
        disabled={isPending}
        className="justify-self-start rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Simpan Harga"}
      </button>
      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}
