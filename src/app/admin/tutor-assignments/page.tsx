import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function AdminTutorAssignmentsPage() {
  const assignments = await prisma.tutor_assignments.findMany({
    orderBy: { created_at: "desc" },
    take: 25,
    include: { courses: true, users_tutor_assignments_tutor_idTousers: true },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Tutor Assignment</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pantau tutor yang ditugaskan untuk mendampingi course.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
            <tr>
              <th className="py-2 pr-4">Tutor</th>
              <th className="py-2 pr-4">Course</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr
                key={assignment.id}
                className="border-t border-slate-200 dark:border-slate-800"
              >
                <td className="py-3 pr-4">
                  {assignment.users_tutor_assignments_tutor_idTousers.fullName}
                </td>
                <td className="py-3 pr-4">{assignment.courses.title}</td>
                <td className="py-3 pr-4">
                  {assignment.is_active ? "active" : "inactive"}
                </td>
              </tr>
            ))}
            {assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  Belum ada tutor assignment.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
