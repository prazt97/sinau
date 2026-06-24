import Link from "next/link";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await prisma.course.findMany({
    where: { status: "published" },
    include: { course_prices: { where: { isActive: true }, take: 1 } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_.8fr] lg:py-28">
        <div>
          <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            Belajar mandiri, tetap didampingi
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Belajar skill baru dengan alur yang jelas.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Sinau adalah LMS untuk belajar mandiri lewat materi terstruktur,
            progres yang terlihat, dan dukungan tutor saat Anda membutuhkannya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Lihat course
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
            >
              Masuk ke Sinau
            </Link>
          </div>
        </div>
        <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
          <p className="text-sm font-medium text-blue-300">
            Cara mulai belajar
          </p>
          <ol className="mt-6 space-y-5">
            <li>
              <span className="mr-3 inline-grid size-7 place-items-center rounded-full bg-blue-500 text-sm">
                1
              </span>
              Pilih course yang sesuai kebutuhan Anda.
            </li>
            <li>
              <span className="mr-3 inline-grid size-7 place-items-center rounded-full bg-blue-500 text-sm">
                2
              </span>
              Lakukan pembayaran manual dan unggah bukti.
            </li>
            <li>
              <span className="mr-3 inline-grid size-7 place-items-center rounded-full bg-blue-500 text-sm">
                3
              </span>
              Admin memverifikasi, lalu akses course dibuka.
            </li>
          </ol>
        </aside>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Course pilihan</p>
            <h2 className="mt-2 text-3xl font-bold">
              Mulai dari course yang tepat
            </h2>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-blue-600">
            Lihat semua course →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {courses.length ? (
            courses.map((course) => (
              <article
                key={course.id}
                className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  {course.level ?? "Course"}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{course.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                  {course.shortDescription ?? course.description}
                </p>
                <p className="mt-5 font-bold">
                  Rp{" "}
                  {Number(
                    course.course_prices[0]?.regularPrice ?? 0,
                  ).toLocaleString("id-ID")}
                </p>
                <Link
                  href={`/courses/${course.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-blue-600"
                >
                  Lihat detail →
                </Link>
              </article>
            ))
          ) : (
            <p className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
              Course akan tampil di sini setelah dipublikasikan.
            </p>
          )}
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          <div>
            <h2 className="font-semibold">Belajar sesuai ritme</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Materi, module, lesson, dan progres tersimpan dalam satu tempat.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Pendampingan tutor</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Tanyakan hal yang menghambat dan dapatkan feedback pada tugas.
            </p>
          </div>
          <div>
            <h2 className="font-semibold">Pembayaran transparan</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Pembayaran dilakukan di luar sistem dan akses dibuka setelah
              verifikasi admin.
            </p>
          </div>
        </div>
      </section>
      <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Sinau. Platform belajar mandiri dengan
        pendampingan tutor.
      </footer>
    </main>
  );
}
