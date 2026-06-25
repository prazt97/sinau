import { prisma } from "@/lib/db/prisma";
import { CourseMenu } from "@/components/course-menu";
export const dynamic = "force-dynamic";
export default async function AdminCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "review" },
    orderBy: { createdAt: "desc" },
    include: {
      users_courses_creator_idTousers: {
        select: { fullName: true, email: true },
      },
      modules: { include: { lessons: true } },
    },
  });
  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Review Course</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Review course yang dikirim creator sebelum tampil di catalog.
        </p>
      </div>

      <div className="mt-5">
        <CourseMenu role="admin" />
      </div>

      <section className="mt-6 space-y-3">
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
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                    {course.status}
                  </span>
                  <h2 className="mt-3 text-base font-semibold">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {course.shortDescription ?? "Belum ada deskripsi singkat."}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Creator:{" "}
                    {course.users_courses_creator_idTousers?.fullName ??
                      "Tidak diketahui"}
                  </p>
                </div>
                <dl className="grid grid-cols-3 gap-2 text-sm lg:w-72">
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
              </div>
            </article>
          );
        })}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada course yang menunggu review.
          </div>
        ) : null}
      </section>
    </main>
  );
}
