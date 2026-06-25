import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TutorCoursesPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "tutor") redirect(`/${session.role}/dashboard`);

  const assignments = await prisma.tutor_assignments.findMany({
    where: { tutor_id: session.id },
    include: {
      courses: {
        include: {
          modules: true,
          enrollments: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Assigned Courses</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Course yang ditugaskan admin untuk pendampingan tutor.
      </p>
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {assignments.map((assignment) => (
          <article
            key={assignment.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span
              className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                assignment.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {assignment.is_active ? "active" : "inactive"}
            </span>
            <h2 className="mt-3 text-base font-semibold">
              {assignment.courses.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {assignment.courses.shortDescription ?? "Course dampingan tutor."}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Modules
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {assignment.courses.modules.length}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  Learners
                </dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {assignment.courses.enrollments.length}
                </dd>
              </div>
            </dl>
          </article>
        ))}
        {assignments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada assigned course.
          </div>
        ) : null}
      </section>
    </main>
  );
}
