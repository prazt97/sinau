import { prisma } from "@/lib/db/prisma";
import { CourseMenu } from "@/components/course-menu";
import {
  CourseReviewActions,
  DeleteCourseContentButton,
} from "./course-review-actions";
export const dynamic = "force-dynamic";
export default async function AdminCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "review" },
    orderBy: { createdAt: "desc" },
    include: {
      users_courses_creator_idTousers: {
        select: { fullName: true, email: true },
      },
      modules: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          lessons: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
          },
        },
      },
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

              <section className="mt-5 grid gap-3">
                <h3 className="text-sm font-semibold">Konten Course</h3>
                {course.modules.map((courseModule) => (
                  <div
                    key={courseModule.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-300">
                          Module {courseModule.sortOrder}
                        </p>
                        <h4 className="mt-1 text-sm font-semibold">
                          {courseModule.title}
                        </h4>
                        {courseModule.description ? (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {courseModule.description}
                          </p>
                        ) : null}
                      </div>
                      <DeleteCourseContentButton
                        courseId={course.id}
                        item={{
                          type: "delete-module",
                          moduleId: courseModule.id,
                          title: courseModule.title,
                        }}
                      />
                    </div>

                    <div className="mt-3 grid gap-2">
                      {courseModule.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex flex-wrap items-start justify-between gap-3 rounded-xl bg-white p-3 text-sm dark:bg-slate-900"
                        >
                          <div>
                            <p className="font-semibold">{lesson.title}</p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {lesson.lessonType}
                            </p>
                            {lesson.content ? (
                              <p className="mt-2 line-clamp-2 text-slate-600 dark:text-slate-300">
                                {lesson.content}
                              </p>
                            ) : null}
                          </div>
                          <DeleteCourseContentButton
                            courseId={course.id}
                            item={{
                              type: "delete-lesson",
                              lessonId: lesson.id,
                              title: lesson.title,
                            }}
                          />
                        </div>
                      ))}
                      {courseModule.lessons.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          Module ini belum memiliki lesson.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
                {course.modules.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    Course belum memiliki module.
                  </p>
                ) : null}
              </section>

              <CourseReviewActions courseId={course.id} />
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
