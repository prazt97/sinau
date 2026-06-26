import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { CourseMenu } from "@/components/course-menu";
import { PriceForm } from "./price-form";

export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function PublishedCoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: {
      modules: {
        include: { lessons: true },
      },
      course_prices: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      users_courses_creator_idTousers: {
        select: { fullName: true, email: true },
      },
    },
  });

  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Published Course</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pantau course yang sudah tampil di katalog dan pasang harga pembelian.
        </p>
      </div>

      <div className="mt-5">
        <CourseMenu role="admin" />
      </div>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {courses.map((course) => {
          const activePrice = course.course_prices[0];
          const regularPrice = Number(activePrice?.regularPrice ?? 0);
          const promoPrice =
            activePrice?.promoPrice === null ||
            activePrice?.promoPrice === undefined
              ? null
              : Number(activePrice.promoPrice);
          const lessonCount = course.modules.reduce(
            (total, module) => total + module.lessons.length,
            0,
          );

          return (
            <article
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-200">
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
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Harga aktif
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">
                    {formatIDR(regularPrice)}
                  </p>
                  {promoPrice !== null ? (
                    <p className="mt-1 text-sm font-semibold tabular-nums text-blue-700 dark:text-blue-200">
                      Promo {formatIDR(promoPrice)}
                    </p>
                  ) : null}
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
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
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <dt className="text-xs text-slate-500 dark:text-slate-400">
                    Published
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {course.publishedAt
                      ? course.publishedAt.toLocaleDateString("id-ID")
                      : "-"}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/courses/${course.slug}`}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Lihat Katalog
                </Link>
              </div>

              <PriceForm
                courseId={course.id}
                regularPrice={regularPrice}
                promoPrice={promoPrice}
              />
            </article>
          );
        })}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada course published.
          </div>
        ) : null}
      </section>
    </main>
  );
}
