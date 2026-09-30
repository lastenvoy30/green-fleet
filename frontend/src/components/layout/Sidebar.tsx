"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const active = pathname === "/dashboard";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[var(--border-color)] bg-[var(--bg-surface)]">

      {/* Brand */}
      <div className="flex h-20 items-center border-b border-[var(--border-color)] px-6">
        <Link href="/" className="block">
          <div className="font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            NavQ
          </div>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-3 py-5">
        <Link
          href="/dashboard"
          className={[
            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors",
            active
              ? "bg-[var(--accent-green-bg)] font-semibold text-[var(--accent-green)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-soft)] hover:text-[var(--text-primary)]",
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-[20px]">
            dashboard
          </span>

          <span>Overview</span>
        </Link>
      </nav>

      

    </aside>
  );
}