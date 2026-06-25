import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { CourseMenu } from "@/components/course-menu";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: {
      modules: { include: { lessons: { where: { isPublished: true } } } },
      course_prices: { where: { isActive: true }, take: 1 },
    },
  });
  if (!course) notFound();
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const enrollment =
    session?.role === "learner"
      ? await prisma.enrollments.findFirst({
          where: {
            learner_id: session.id,
            course_id: course.id,
            status: { in: ["active", "completed"] },
          },
        })
      : null;
  const lessonCount = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <CourseMenu role="learner" />

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              {course.level ?? "course"}
            </span>
            <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-200">
              published
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-bold">{course.title}</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {course.description ?? course.shortDescription}
          </p>

          <h2 className="mt-8 text-lg font-semibold">Kurikulum</h2>
          <div className="mt-3 space-y-3">
            {course.modules.map((module) => (
              <section
                key={module.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="font-semibold">{module.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-950"
                    >
                      {lesson.title}
                    </li>
                  ))}
                  {module.lessons.length === 0 ? (
                    <li className="text-slate-500 dark:text-slate-400">
                      Belum ada lesson published.
                    </li>
                  ) : null}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Harga Course
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums">
            {formatIDR(Number(course.course_prices[0]?.regularPrice ?? 0))}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
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
              <dd className="mt-1 font-semibold tabular-nums">{lessonCount}</dd>
            </div>
          </dl>
          {enrollment ? (
            <Link
              href={`/learner/courses/${course.id}/player`}
              className="mt-5 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Lanjutkan Belajar
            </Link>
          ) : (
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-100">
              Course masih terkunci. Selesaikan pembayaran manual dan tunggu
              approval admin untuk membuka akses.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}
