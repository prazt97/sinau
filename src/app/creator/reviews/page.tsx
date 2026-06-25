import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function CreatorReviewsPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (!["creator", "admin"].includes(session.role))
    redirect(`/${session.role}/dashboard`);

  const courses = await prisma.course.findMany({
    where: {
      ...(session.role === "admin" ? {} : { creatorId: session.id }),
      status: { in: ["review", "published", "archived"] },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Submissions</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pantau course yang sudah dikirim ke review admin.
      </p>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusClass[course.status]}`}
            >
              {course.status}
            </span>
            <h2 className="mt-3 text-base font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {course.reviewNotes ??
                course.shortDescription ??
                "Belum ada catatan review."}
            </p>
            <Link
              href={`/creator/courses/${course.id}/builder`}
              className="mt-4 inline-block rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Open Builder
            </Link>
          </article>
        ))}
        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada submission review.
          </div>
        ) : null}
      </section>
    </main>
  );
}
