"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = {
  learner: [
    ["Dashboard", "/learner/dashboard"],
    ["Catalog", "/catalog"],
    ["My Courses", "/learner/courses"],
    ["Payment Status", "/learner/payments"],
    ["Discussion", "/learner/discussions"],
    ["Profile", "/learner/profile"],
  ],
  creator: [
    ["Dashboard", "/creator/dashboard"],
    ["My Courses", "/creator/courses"],
    ["Course Builder", "/creator/courses/new"],
    ["Submissions for Review", "/creator/reviews"],
    ["Profile", "/creator/profile"],
  ],
  tutor: [
    ["Dashboard", "/tutor/dashboard"],
    ["Assigned Courses", "/tutor/courses"],
    ["Learners", "/tutor/learners"],
    ["Discussions", "/tutor/discussions"],
    ["Assignment Reviews", "/tutor/assignments"],
    ["Profile", "/tutor/profile"],
  ],
  admin: [
    ["Dashboard", "/admin/dashboard", "Ringkasan operasional"],
    ["Users", "/admin/users", "User dan role"],
    ["Courses", "/admin/courses", "Review dan publish"],
    ["Pricing", "/admin/pricing", "Harga course"],
    ["Vouchers", "/admin/vouchers", "Diskon dan limit"],
    ["Payments", "/admin/payments", "Verifikasi manual"],
    ["Enrollments", "/admin/enrollments", "Akses learner"],
    ["Tutor Assignment", "/admin/tutor-assignments", "Penugasan tutor"],
    ["Reports", "/admin/reports", "Laporan dasar"],
    ["Settings", "/admin/settings", "Konfigurasi"],
  ],
} as const;

export function RoleNavigation({ role }: { role: keyof typeof navigation }) {
  const pathname = usePathname();
  const items = navigation[role];
  const isAdmin = role === "admin";

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:block">
        <Link
          href={`/${role}/dashboard`}
          className="block rounded-xl px-2 py-1 text-xl font-bold text-blue-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400"
        >
          Sinau
        </Link>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
          <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
            {role}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Role-aware menu
          </span>
        </div>
        <nav aria-label={`${role} navigation`} className="mt-6 space-y-1">
          {items.map(([label, href, description]) => {
            const isActive =
              pathname === href ||
              (href !== `/${role}/dashboard` &&
                pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`block rounded-xl px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span className="block font-medium">{label}</span>
                {isAdmin && description ? (
                  <span
                    className={`mt-0.5 block text-xs ${
                      isActive
                        ? "text-blue-100"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {description}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </aside>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-10 flex gap-1 overflow-x-auto border-t border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900 md:hidden"
      >
        {items.map(([label, href]) => {
          const isActive =
            pathname === href ||
            (href !== `/${role}/dashboard` && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-max rounded-lg px-3 py-2 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
