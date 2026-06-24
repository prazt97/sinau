import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { readSession, sessionCookie } from "@/lib/auth/session";
export default async function CourseDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: {
      modules: { include: { lessons: { where: { isPublished: true } } } },
      course_prices: { where: { isActive: true }, take: 1 },
    },
  });
  if (!course) notFound();
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  const enrollment =
    session?.role === "learner"
      ? await prisma.enrollments.findFirst({
          where: {
            learner_id: session.id,
            course_id: course.id,
            status: { in: ["active", "completed"] },
          },
        })
      : null;
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="mt-4 text-slate-600">{course.description}</p>
      <p className="mt-6 text-xl font-bold">
        Rp{" "}
        {Number(course.course_prices[0]?.regularPrice ?? 0).toLocaleString(
          "id-ID",
        )}
      </p>
      {!enrollment && (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Course masih terkunci. Selesaikan pembayaran manual dan tunggu
          approval admin untuk membuka akses.
        </p>
      )}
      <h2 className="mt-8 text-lg font-semibold">Kurikulum</h2>
      {course.modules.map((module) => (
        <section key={module.id} className="mt-3 rounded-xl bg-white p-4">
          <h3 className="font-medium">{module.title}</h3>
          <ul className="mt-2 text-sm text-slate-600">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>{lesson.title}</li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
