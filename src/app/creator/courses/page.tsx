import Link from "next/link";
import { cookies } from "next/headers";
import { CourseMenu } from "@/components/course-menu";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

const statusClass: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  review: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  published:
    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200",
  archived: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
};

export default async function CreatorCoursesPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const courses =
    session?.role === "creator" || session?.role === "admin"
      ? await prisma.course.findMany({
          where: session.role === "admin" ? {} : { creatorId: session.id },
          orderBy: { updatedAt: "desc" },
          include: { modules: { include: { lessons: true } } },
        })
      : [];

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Kelola draft, module, lesson, dan status review course.
          </p>
        </div>
        <Link
          href="/creator/courses/new"
          className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Create Draft
        </Link>
      </div>

      <div className="mt-5">
        <CourseMenu role="creator" />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {courses.map((course) => {
          const lessonCount = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0,
          );

          return (
            <article
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span
                    className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusClass[course.status]}`}
                  >
                    {course.status}
                  </span>
                  <h2 className="mt-3 text-base font-semibold">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {course.shortDescription ?? "Belum ada deskripsi singkat."}
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Level
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {course.level ?? "course"}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Module
                  </dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {course.modules.length}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Lesson
                  </dt>
                  <dd className="mt-1 font-semibold tabular-nums">
                    {lessonCount}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/creator/courses/${course.id}/builder`}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Open Builder
                </Link>
                {course.status === "published" ? (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    View Detail
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada course. Buat draft pertama untuk mulai menyusun module dan
            lesson.
          </div>
        ) : null}
      </section>
    </main>
  );
}
