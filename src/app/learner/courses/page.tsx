import { cookies } from "next/headers";
import Link from "next/link";
import { CourseMenu } from "@/components/course-menu";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export const dynamic = "force-dynamic";
export default async function MyCourses() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const enrollments = session
    ? await prisma.enrollments.findMany({
        where: {
          learner_id: session.id,
          status: { in: ["active", "completed"] },
        },
        include: { courses: true },
      })
    : [];
  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Course Saya</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Lanjutkan course yang sudah terbuka melalui enrollment aktif.
        </p>
      </div>

      <div className="mt-5">
        <CourseMenu role="learner" />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {enrollments.map((item) => {
          const progress = Number(item.progress_percent);

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                    {item.status}
                  </span>
                  <h2 className="mt-3 text-base font-semibold">
                    {item.courses.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.courses.shortDescription ??
                      "Belajar mandiri sesuai progres Anda."}
                  </p>
                </div>
                <p className="text-2xl font-bold tabular-nums">
                  {progress.toFixed(0)}%
                </p>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <Link
                href={`/learner/courses/${item.courses.id}/player`}
                className="mt-5 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Lanjutkan Belajar
              </Link>
            </article>
          );
        })}
        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada course aktif.
          </div>
        ) : null}
      </section>
    </main>
  );
}
