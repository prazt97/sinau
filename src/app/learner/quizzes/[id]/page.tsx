"use client";
import { FormEvent, useState } from "react";
export default function QuizPlayer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [message, setMessage] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = (await params).id;
    const answers = Object.fromEntries(new FormData(e.currentTarget));
    const result = await fetch(`/api/quizzes/${id}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).then((r) => r.json());
    setMessage(result.message);
  }
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <textarea
          name="answer"
          required
          placeholder="Tulis jawaban Anda"
          className="min-h-32 rounded-lg border p-3"
        />
        <button className="rounded-xl bg-blue-600 p-3 text-white">
          Kirim Jawaban
        </button>
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}
