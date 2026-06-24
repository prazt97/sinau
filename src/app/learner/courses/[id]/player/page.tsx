import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export default async function Player({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const enrollment = session
    ? await prisma.enrollments.findFirst({
        where: {
          learner_id: session.id,
          course_id: id,
          status: { in: ["active", "completed"] },
        },
        include: {
          courses: {
            include: {
              modules: {
                include: { lessons: { where: { isPublished: true } } },
              },
            },
          },
        },
      })
    : null;
  if (!enrollment) notFound();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{enrollment.courses.title}</h1>
      {enrollment.courses.modules.map((module) => (
        <section key={module.id} className="mt-4">
          <h2>{module.title}</h2>
          {module.lessons.map((lesson) => (
            <article key={lesson.id} className="mt-2 rounded-xl bg-white p-4">
              <h3>{lesson.title}</h3>
              <p>{lesson.content}</p>
            </article>
          ))}
        </section>
      ))}
    </main>
  );
}
