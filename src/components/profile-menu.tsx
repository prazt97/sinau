"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  ["Overview", "#overview"],
  ["Account", "#account"],
  ["Security", "#security"],
] as const;

export function ProfileMenu({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Profile menu"
      className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex min-w-max gap-2">
        <Link
          href={`/${role}/profile`}
          aria-current="page"
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="block font-semibold">Profile</span>
          <span className="mt-0.5 block text-xs text-blue-100">{pathname}</span>
        </Link>
        {sections.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="block font-semibold">{label}</span>
            <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
              Profile section
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
