"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const enabled =
      saved === "dark" ||
      (!saved && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", enabled);
    // The initial value is read only after browser hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(enabled);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ubah tema"
      className="rounded-lg border px-3 py-2 text-sm"
    >
      {dark ? "Mode terang" : "Mode gelap"}
    </button>
  );
}
