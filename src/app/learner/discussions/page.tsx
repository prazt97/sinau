import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function LearnerDiscussionsPage() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== "learner") redirect(`/${session.role}/dashboard`);

  const discussions = await prisma.discussions.findMany({
    where: { learner_id: session.id },
    include: {
      courses: true,
      lessons: true,
      discussion_replies: true,
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Discussions</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Pantau pertanyaan Anda di course yang sudah dienroll.
      </p>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {discussions.map((discussion) => (
          <article
            key={discussion.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  {discussion.status}
                </span>
                <h2 className="mt-3 text-base font-semibold">
                  {discussion.title}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {discussion.courses.title}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                {discussion.discussion_replies.length} replies
              </p>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {discussion.body}
            </p>
          </article>
        ))}
        {discussions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Belum ada diskusi.
          </div>
        ) : null}
      </section>
    </main>
  );
}
