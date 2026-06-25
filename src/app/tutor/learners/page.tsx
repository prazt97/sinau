import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function TutorLearnersPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "tutor") redirect(`/${session.role}/dashboard`);

  const assignments = await prisma.tutor_assignments.findMany({
    where: { tutor_id: session.id, is_active: true },
    select: { course_id: true },
  });
  const enrollments = await prisma.enrollments.findMany({
    where: { course_id: { in: assignments.map((item) => item.course_id) } },
    include: { courses: true, users_enrollments_learner_idTousers: true },
    orderBy: { enrolled_at: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Learners</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pantau learner dan progres pada course yang ditugaskan.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="py-2 pr-4">Learner</th>
              <th className="py-2 pr-4">Course</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Progress</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr
                key={enrollment.id}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                <td className="py-3 pr-4">
                  {enrollment.users_enrollments_learner_idTousers.fullName}
                </td>
                <td className="py-3 pr-4">{enrollment.courses.title}</td>
                <td className="py-3 pr-4">{enrollment.status}</td>
                <td className="py-3 pr-4 tabular-nums">
                  {Number(enrollment.progress_percent).toFixed(0)}%
                </td>
              </tr>
            ))}
            {enrollments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  Belum ada learner.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
