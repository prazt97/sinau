const settings = [
  ["Payment", "Pembayaran tetap manual di luar sistem Sinau."],
  ["Course Access", "Akses course dibuka melalui enrollment active."],
  ["Storage", "Bukti pembayaran dan materi disimpan melalui storage adapter."],
  ["Deployment", "Target production menggunakan Railway dan PostgreSQL."],
];

export default function AdminSettingsPage() {
  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Konfigurasi operasional MVP yang mengikuti Source of Truth Sinau.
      </p>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        {settings.map(([title, description]) => (
          <article
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
