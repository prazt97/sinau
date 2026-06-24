import { prisma } from "@/lib/db/prisma";
export default async function AdminCourses() {
  const courses = await prisma.course.findMany({
    where: { status: "review" },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Review Course</h1>
      <div className="mt-6 space-y-3">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold">{course.title}</h2>
            <p className="text-sm text-slate-600">{course.shortDescription}</p>
            <p className="mt-2 text-xs">Status: {course.status}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
