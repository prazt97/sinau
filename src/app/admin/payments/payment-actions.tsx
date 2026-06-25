"use client";

import { FormEvent, useState } from "react";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function verify(action: "approve" | "reject", reason?: string) {
    setIsPending(true);
    setMessage("");
    const response = await fetch(`/api/admin/payments/${paymentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason }),
    });
    const result = await response.json();
    setMessage(result.message);
    setIsPending(false);
  }

  async function reject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reason = String(
      new FormData(event.currentTarget).get("reason") ?? "",
    );
    if (!reason.trim()) return setMessage("Alasan reject wajib diisi");
    await verify("reject", reason);
  }

  return (
    <div className="mt-4 grid gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => verify("approve")}
        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Approve Payment
      </button>
      <form onSubmit={reject} className="grid gap-2">
        <label className="grid gap-1 text-sm font-medium">
          Alasan reject
          <input
            name="reason"
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <button
          disabled={isPending}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
        >
          Reject Payment
        </button>
      </form>
      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}
    </div>
  );
}
