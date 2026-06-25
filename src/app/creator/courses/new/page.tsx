"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseMenu } from "@/components/course-menu";
export default function NewCourse() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const r = await fetch("/api/courses/creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
    });
    const d = await r.json();
    setMessage(d.message);
    if (r.ok) router.push("/creator/dashboard");
  }
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Buat Course Draft</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Course baru akan dibuat sebagai draft dan perlu review admin sebelum
          published.
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
          Judul course <span className="text-red-600">*</span>
          <input
            name="title"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Slug <span className="text-red-600">*</span>
          <input
            name="slug"
            required
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Level
          <select
            name="level"
            className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Deskripsi singkat
          <textarea
            name="shortDescription"
            className="min-h-24 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Deskripsi lengkap
          <textarea
            name="description"
            className="min-h-32 rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
          />
        </label>
        <button className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500">
          Simpan Draft
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
