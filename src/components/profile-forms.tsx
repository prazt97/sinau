"use client";

import { FormEvent, useState } from "react";

type ProfileFormProps = {
  fullName: string;
  phone: string;
  avatarUrl: string;
};

export function EditProfileForm({
  fullName,
  phone,
  avatarUrl,
}: ProfileFormProps) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        Object.fromEntries(new FormData(event.currentTarget)),
      ),
    });
    const result = await response.json();
    setMessage(result.message);
    setIsPending(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1 text-sm font-medium">
        Nama lengkap <span className="text-red-600">*</span>
        <input
          name="fullName"
          required
          defaultValue={fullName}
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Nomor telepon
        <input
          name="phone"
          defaultValue={phone}
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Avatar URL
        <input
          name="avatarUrl"
          type="url"
          defaultValue={avatarUrl}
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <button
        disabled={isPending}
        className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Menyimpan..." : "Simpan Profile"}
      </button>
      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function PasswordResetForm() {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setMessage("");
    const form = event.currentTarget;
    const response = await fetch("/api/profile/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json();
    setMessage(result.message);
    if (response.ok) form.reset();
    setIsPending(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1 text-sm font-medium">
        Password lama <span className="text-red-600">*</span>
        <input
          name="currentPassword"
          type="password"
          required
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Password baru <span className="text-red-600">*</span>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Konfirmasi password baru <span className="text-red-600">*</span>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className="rounded-lg border border-slate-200 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
        />
      </label>
      <button
        disabled={isPending}
        className="justify-self-end rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Memperbarui..." : "Update Password"}
      </button>
      {message ? (
        <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}
