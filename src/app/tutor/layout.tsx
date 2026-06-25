import { ReactNode } from "react";
import { RoleNavigation } from "@/components/role-navigation";

export default function TutorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <RoleNavigation role="tutor" />
        <div className="min-w-0 flex-1 pb-24 md:pb-6">{children}</div>
      </div>
    </div>
  );
}
