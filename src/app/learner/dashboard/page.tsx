import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function LearnerDashboardPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "learner") redirect(`/${session.role}/dashboard`);

  const [enrollments, pendingPayments, discussions] = await Promise.all([
    prisma.enrollments.findMany({
      where: { learner_id: session.id },
      include: { courses: true },
      orderBy: { enrolled_at: "desc" },
      take: 4,
    }),
    prisma.payment_confirmations.count({
      where: { learner_id: session.id, status: "pending" },
    }),
    prisma.discussions.count({ where: { learner_id: session.id } }),
  ]);
  const activeCourses = enrollments.filter((item) => item.status === "active");
  const averageProgress = enrollments.length
    ? enrollments.reduce(
        (total, item) => total + Number(item.progress_percent),
        0,
      ) / enrollments.length
    : 0;

  const stats = [
    ["Active Courses", activeCourses.length.toLocaleString("id-ID")],
    ["Pending Payment", pendingPayments.toLocaleString("id-ID")],
    ["Discussions", discussions.toLocaleString("id-ID")],
    ["Avg Progress", `${averageProgress.toFixed(0)}%`],
  ];

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Learner</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ringkasan course, pembayaran, dan progres belajar Anda.
          </p>
        </div>
        <Link
          href="/catalog"
          className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Browse Catalog
        </Link>
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

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Course Terbaru</h2>
          <Link
            href="/learner/courses"
            className="text-sm font-semibold text-blue-600 dark:text-blue-300"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {enrollments.map((item) => (
            <article
              key={item.id}
              className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                    {item.status}
                  </span>
                  <h3 className="mt-3 font-semibold">{item.courses.title}</h3>
                </div>
                <p className="font-bold tabular-nums">
                  {Number(item.progress_percent).toFixed(0)}%
                </p>
              </div>
            </article>
          ))}
          {enrollments.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Belum ada course aktif.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
