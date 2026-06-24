"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function UserForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const result = await response.json();
    setMessage(result.message);
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  return (
    <form
      onSubmit={submit}
      className="mt-6 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4"
    >
      <input
        name="fullName"
        required
        placeholder="Nama lengkap"
        className="rounded-lg border p-3"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border p-3"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="rounded-lg border p-3"
      />
      <select name="role" className="rounded-lg border p-3">
        <option value="learner">Learner</option>
        <option value="creator">Creator</option>
        <option value="tutor">Tutor</option>
        <option value="admin">Admin</option>
      </select>
      <button className="rounded-xl bg-blue-600 p-3 text-white">
        Buat User
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
