import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

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
    <main className="p-6">
      <h1 className="text-2xl font-bold">Catalog Course</h1>
      <form className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari course"
          className="rounded-lg border p-2"
        />
        <select
          name="level"
          defaultValue={level}
          className="rounded-lg border p-2"
        >
          <option value="">Semua level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button className="rounded-lg bg-blue-600 px-4 text-white">Cari</button>
      </form>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl bg-white p-5 shadow-sm"
          >
            <p className="text-xs text-blue-600">{course.level ?? "course"}</p>
            <h2 className="mt-2 font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {course.shortDescription}
            </p>
            <p className="mt-4 font-bold">
              Rp{" "}
              {Number(
                course.course_prices[0]?.regularPrice ?? 0,
              ).toLocaleString("id-ID")}
            </p>
            <Link
              className="mt-4 inline-block text-sm text-blue-600"
              href={`/courses/${course.slug}`}
            >
              Lihat detail
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
