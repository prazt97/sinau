import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileForm, PasswordResetForm } from "@/components/profile-forms";
import { LogoutButton } from "@/components/logout-button";
import { ProfileMenu } from "@/components/profile-menu";
import { readSession, sessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const roleClass: Record<string, string> = {
  learner: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  creator:
    "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200",
  tutor: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
  admin: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
};

const statusClass: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200",
  inactive: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  suspended: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
};

export async function ProfilePage({ role }: { role: string }) {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session) redirect("/auth/login");
  if (session.role !== role) redirect(`/${session.role}/profile`);

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) redirect("/auth/login");

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Kelola informasi akun, profil, dan keamanan login.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-5">
        <ProfileMenu role={role} />
      </div>

      <section
        id="overview"
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">{user.fullName}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {user.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${roleClass[user.role]}`}
                >
                  {user.role}
                </span>
                <span
                  className={`rounded-lg px-2 py-1 text-xs font-semibold ${statusClass[user.status]}`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2 md:w-96">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                Phone
              </dt>
              <dd className="mt-1 font-semibold">
                {user.phone ?? "Belum diisi"}
              </dd>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
              <dt className="text-xs text-slate-500 dark:text-slate-400">
                Last login
              </dt>
              <dd className="mt-1 font-semibold">
                {user.lastLoginAt
                  ? user.lastLoginAt.toLocaleDateString("id-ID")
                  : "Belum tercatat"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article
          id="account"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-lg font-semibold">Account</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Update nama, nomor telepon, dan avatar profil.
          </p>
          <div className="mt-5">
            <EditProfileForm
              fullName={user.fullName}
              phone={user.phone ?? ""}
              avatarUrl={user.avatarUrl ?? ""}
            />
          </div>
        </article>

        <article
          id="security"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Ganti password menggunakan password lama sebagai verifikasi.
          </p>
          <div className="mt-5">
            <PasswordResetForm />
          </div>
        </article>
      </section>
    </main>
  );
}
