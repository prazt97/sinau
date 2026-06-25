"use client";
import { FormEvent, useState } from "react";
import { CourseMenu } from "@/components/course-menu";
export default function Builder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = (await params).id;
    const r = await fetch(`/api/courses/${id}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    setMessage((await r.json()).message);
    if (r.ok) e.currentTarget.reset();
  }
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Course Builder</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Susun module dan lesson untuk course draft atau review.
        </p>
      </div>

      <div className="mt-5">
        <CourseMenu role="creator" />
      </div>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <label className="grid gap-1 text-sm font-medium">
          Jenis konten
          <select
            name="type"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          >
            <option value="module">Module</option>
            <option value="lesson">Lesson</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          ID module untuk lesson
          <input
            name="moduleId"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Judul <span className="text-red-600">*</span>
          <input
            name="title"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Deskripsi module
          <textarea
            name="description"
            className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Konten lesson
          <textarea
            name="content"
            className="min-h-32 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <button className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
          Simpan Konten
        </button>
        {message && (
          <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
