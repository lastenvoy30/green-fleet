"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme =
        currentTheme === "light" ? "dark" : "light";

      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      localStorage.setItem("theme", nextTheme);

      return nextTheme;
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6">

      {/* Left side */}
      <div>
        <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">
          Fleet Intelligence Platform
        </p>

        
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Theme button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-soft)] hover:text-[var(--text-primary)]"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>

        

        

      </div>

    </header>
  );
}