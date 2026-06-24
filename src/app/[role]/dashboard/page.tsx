import { notFound } from "next/navigation";

const roles = ["learner", "creator", "tutor", "admin"] as const;

export default async function Dashboard({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!roles.includes(role as (typeof roles)[number])) notFound();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard {role}</h1>
      <p className="mt-2 text-slate-600">
        Autentikasi dan akses berbasis role telah aktif.
      </p>
    </main>
  );
}
