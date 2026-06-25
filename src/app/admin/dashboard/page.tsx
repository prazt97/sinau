import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function AdminDashboardPage() {
  const [learners, creators, tutors, publishedCourses, reviewCourses, pendingPayments, approvedPayments] =
    await Promise.all([
      prisma.user.count({ where: { role: "learner" } }),
      prisma.user.count({ where: { role: "creator" } }),
      prisma.user.count({ where: { role: "tutor" } }),
      prisma.course.count({ where: { status: "published" } }),
      prisma.course.count({ where: { status: "review" } }),
      prisma.payment_confirmations.count({ where: { status: "pending" } }),
      prisma.payment_confirmations.findMany({
        where: { status: "approved" },
        select: { paid_amount: true },
      }),
    ]);
  const revenue = approvedPayments.reduce(
    (total, payment) => total + Number(payment.paid_amount),
    0,
  );
  const stats = [
    ["Learner", learners.toLocaleString("id-ID")],
    ["Creator", creators.toLocaleString("id-ID")],
    ["Tutor", tutors.toLocaleString("id-ID")],
    ["Course Published", publishedCourses.toLocaleString("id-ID")],
    ["Course Review", reviewCourses.toLocaleString("id-ID")],
    ["Payment Pending", pendingPayments.toLocaleString("id-ID")],
    ["Revenue", formatIDR(revenue)],
  ];

  const actions = [
    ["Review Course", "/admin/courses"],
    ["Verifikasi Payment", "/admin/payments"],
    ["Kelola Voucher", "/admin/vouchers"],
    ["Lihat Reports", "/admin/reports"],
  ];

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ringkasan operasional Sinau untuk payment, course, dan user.
          </p>
        </div>
        <span className="w-fit rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Admin
        </span>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Aksi Utama</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition hover:border-blue-300 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-blue-950"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
