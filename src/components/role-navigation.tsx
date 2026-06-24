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
    ["Dashboard", "/admin/dashboard"],
    ["Users", "/admin/users"],
    ["Courses", "/admin/courses"],
    ["Pricing", "/admin/pricing"],
    ["Vouchers", "/admin/vouchers"],
    ["Payments", "/admin/payments"],
    ["Enrollments", "/admin/enrollments"],
    ["Tutor Assignment", "/admin/tutor-assignments"],
    ["Reports", "/admin/reports"],
    ["Settings", "/admin/settings"],
  ],
} as const;

export function RoleNavigation({ role }: { role: keyof typeof navigation }) {
  const pathname = usePathname();
  const items = navigation[role];

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r bg-white p-4 dark:bg-slate-900 md:block">
        <Link
          href={`/${role}/dashboard`}
          className="mb-6 block text-xl font-bold text-blue-600"
        >
          Sinau
        </Link>
        <nav className="space-y-1">
          {items.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-xl px-3 py-2 text-sm ${pathname === href ? "bg-blue-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-10 flex gap-1 overflow-x-auto border-t bg-white p-2 dark:bg-slate-900 md:hidden"
      >
        {items.slice(0, 5).map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className={`min-w-max rounded-lg px-3 py-2 text-xs ${pathname === href ? "bg-blue-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
