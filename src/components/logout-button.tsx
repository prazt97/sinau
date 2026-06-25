"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isPending}
      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 outline-none transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
    >
      {isPending ? "Keluar..." : "Logout"}
    </button>
  );
}
