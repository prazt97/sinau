import { notFound } from "next/navigation";

const titles: Record<string, Record<string, string>> = {
  learner: {},
  creator: {},
  tutor: {},
  admin: {
    enrollments: "Enrollments",
    "tutor-assignments": "Tutor Assignment",
    settings: "Settings",
  },
};
export default async function RoleSection({
  params,
}: {
  params: Promise<{ role: string; section: string }>;
}) {
  const { role, section } = await params;
  const title = titles[role]?.[section];
  if (!title) notFound();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Halaman {title} tersedia dalam navigasi {role}. Fitur MVP terkait akan
        ditampilkan di sini.
      </p>
    </main>
  );
}
