"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = {
  admin: [
    ["Pricing", "/admin/pricing", "Harga course"],
    ["Vouchers", "/admin/vouchers", "Diskon dan limit"],
    ["Payments", "/admin/payments", "Verifikasi manual"],
    ["Reports", "/admin/reports", "Laporan revenue"],
  ],
  learner: [
    ["Confirm Payment", "/learner/payments/new", "Kirim bukti bayar"],
    ["Payment Status", "/learner/payments", "Pantau verifikasi"],
    ["Catalog", "/catalog", "Pilih course"],
  ],
} as const;

export function PaymentPricingMenu({ role }: { role: keyof typeof menus }) {
  const pathname = usePathname();
  const items = menus[role];

  return (
    <nav
      aria-label="Pricing and payment menu"
      className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex min-w-max gap-2">
        {items.map(([label, href, description]) => {
          const isActive =
            pathname === href ||
            (href !== "/catalog" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-xl px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <span className="block font-semibold">{label}</span>
              <span
                className={`mt-0.5 block text-xs ${
                  isActive
                    ? "text-blue-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {description}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
