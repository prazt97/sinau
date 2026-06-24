"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
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
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Buat Course Draft</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input
          name="title"
          required
          placeholder="Judul course"
          className="rounded-lg border p-3"
        />
        <input
          name="slug"
          required
          placeholder="slug-course"
          className="rounded-lg border p-3"
        />
        <select name="level" className="rounded-lg border p-3">
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <textarea
          name="shortDescription"
          placeholder="Deskripsi singkat"
          className="rounded-lg border p-3"
        />
        <textarea
          name="description"
          placeholder="Deskripsi lengkap"
          className="rounded-lg border p-3"
        />
        <button className="rounded-xl bg-blue-600 p-3 text-white">
          Simpan Draft
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
