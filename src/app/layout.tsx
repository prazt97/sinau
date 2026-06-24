import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sinau",
  description: "Learning Management System Sinau",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body><header className="flex justify-end p-4"><ThemeToggle /></header>{children}</body>
    </html>
  );
}
