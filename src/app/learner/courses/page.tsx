import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export const dynamic = "force-dynamic";
export default async function MyCourses() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const enrollments = session
    ? await prisma.enrollments.findMany({
        where: {
          learner_id: session.id,
          status: { in: ["active", "completed"] },
        },
        include: { courses: true },
      })
    : [];
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Course Saya</h1>
      {enrollments.map((item) => (
        <article key={item.id} className="mt-3 rounded-xl bg-white p-4">
          <h2>{item.courses.title}</h2>
          <p>{Number(item.progress_percent)}%</p>
          <Link href={`/learner/courses/${item.courses.id}/player`}>
            Lanjutkan belajar
          </Link>
        </article>
      ))}
    </main>
  );
}
