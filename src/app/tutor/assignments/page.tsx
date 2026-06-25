import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TutorAssignmentsPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "tutor") redirect(`/${session.role}/dashboard`);

  const assignments = await prisma.tutor_assignments.findMany({
    where: { tutor_id: session.id, is_active: true },
    select: { course_id: true },
  });
  const submissions = await prisma.assignment_submissions.findMany({
    where: {
      assignments: {
        course_id: { in: assignments.map((item) => item.course_id) },
      },
    },
    include: {
      assignments: { include: { courses: true } },
      users_assignment_submissions_learner_idTousers: true,
    },
    orderBy: { submitted_at: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Assignment Reviews</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Review submission learner dan berikan feedback pada tugas.
      </p>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {submissions.map((submission) => (
          <article
            key={submission.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-200">
                  {submission.status}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {submission.assignments.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {
                    submission.users_assignment_submissions_learner_idTousers
                      .fullName
                  }{" "}
                  - {submission.assignments.courses.title}
                </p>
              </div>
              <p className="font-bold tabular-nums">
                {submission.score ? Number(submission.score).toFixed(0) : "-"}
              </p>
            </div>
            {submission.feedback ? (
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                {submission.feedback}
              </p>
            ) : null}
          </article>
        ))}
        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada assignment untuk direview.
          </div>
        ) : null}
      </section>
    </main>
  );
}
