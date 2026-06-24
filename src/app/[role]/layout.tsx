import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { RoleNavigation } from "@/components/role-navigation";

const roles = ["learner", "creator", "tutor", "admin"] as const;

export default async function RoleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!roles.includes(role as (typeof roles)[number])) notFound();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <RoleNavigation role={role as (typeof roles)[number]} />
        <main className="min-w-0 flex-1 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
