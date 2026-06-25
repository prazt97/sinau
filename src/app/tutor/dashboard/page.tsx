import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TutorDashboardPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "tutor") redirect(`/${session.role}/dashboard`);

  const assignments = await prisma.tutor_assignments.findMany({
    where: { tutor_id: session.id, is_active: true },
    include: { courses: true },
  });
  const courseIds = assignments.map((item) => item.course_id);
  const [learners, discussions, submissions] = await Promise.all([
    prisma.enrollments.count({ where: { course_id: { in: courseIds } } }),
    prisma.discussions.count({ where: { course_id: { in: courseIds } } }),
    prisma.assignment_submissions.count({
      where: { assignments: { course_id: { in: courseIds } } },
    }),
  ]);
  const stats = [
    ["Assigned Courses", assignments.length.toLocaleString("id-ID")],
    ["Learners", learners.toLocaleString("id-ID")],
    ["Discussions", discussions.toLocaleString("id-ID")],
    ["Submissions", submissions.toLocaleString("id-ID")],
  ];

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Tutor</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ringkasan course dampingan, learner, diskusi, dan tugas.
          </p>
        </div>
        <Link
          href="/tutor/discussions"
          className="w-fit rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Review Discussions
        </Link>
      </div>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
