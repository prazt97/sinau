import Link from "next/link";
import { CourseMenu } from "@/components/course-menu";
import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";

const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; level?: string }>;
}) {
  const { q, level } = await searchParams;
  const courses = await prisma.course.findMany({
    where: {
      status: "published",
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
      ...(level ? { level } : {}),
    },
    include: { course_prices: { where: { isActive: true }, take: 1 } },
  });
  return (
    <main className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Catalog Course</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Pilih course published, cek harga, lalu lakukan pembayaran manual.
        </p>
      </div>

      <div className="mt-5">
        <CourseMenu role="learner" />
      </div>

      <form className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_220px_auto]">
        <label className="grid gap-1 text-sm font-medium">
          Cari course
          <input
            name="q"
            defaultValue={q}
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Level
          <select
            name="level"
            defaultValue={level}
            className="rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          >
            <option value="">Semua level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <button className="self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
          Cari
        </button>
      </form>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                {course.level ?? "course"}
              </span>
              <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-200">
                published
              </span>
            </div>
            <h2 className="mt-4 text-base font-semibold">{course.title}</h2>
            <p className="mt-2 min-h-10 text-sm text-slate-600 dark:text-slate-300">
              {course.shortDescription ?? "Deskripsi course belum tersedia."}
            </p>
            <p className="mt-4 text-xl font-bold tabular-nums">
              {formatIDR(Number(course.course_prices[0]?.regularPrice ?? 0))}
            </p>
            <Link
              className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
              href={`/courses/${course.slug}`}
            >
              Lihat Detail
            </Link>
          </article>
        ))}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 md:col-span-2 xl:col-span-3">
            Belum ada course yang tersedia.
          </div>
        ) : null}
      </section>
    </main>
  );
}
