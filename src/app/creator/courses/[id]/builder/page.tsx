"use client";
import { FormEvent, useState } from "react";
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
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Course Builder</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <select name="type" className="rounded-lg border p-3">
          <option value="module">Module</option>
          <option value="lesson">Lesson</option>
        </select>
        <input
          name="moduleId"
          placeholder="ID module (untuk lesson)"
          className="rounded-lg border p-3"
        />
        <input
          name="title"
          required
          placeholder="Judul"
          className="rounded-lg border p-3"
        />
        <textarea
          name="description"
          placeholder="Deskripsi module"
          className="rounded-lg border p-3"
        />
        <textarea
          name="content"
          placeholder="Konten lesson"
          className="rounded-lg border p-3"
        />
        <button className="rounded-xl bg-blue-600 p-3 text-white">
          Simpan Konten
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
