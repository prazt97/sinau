import Link from "next/link";
export default function CreatorDashboard() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Creator</h1>
      <Link
        className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-3 text-white"
        href="/creator/courses/new"
      >
        Buat Course
      </Link>
    </main>
  );
}
