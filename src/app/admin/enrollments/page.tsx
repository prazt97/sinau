import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollments.findMany({
    orderBy: { enrolled_at: "desc" },
    take: 25,
    include: { courses: true, users_enrollments_learner_idTousers: true },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Enrollments</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pantau akses course learner yang aktif, completed, atau suspended.
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
                  Belum ada enrollment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
