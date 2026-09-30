"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {

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
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

      {/* Navigation */}
      <header className="border-b border-[var(--border-color)] bg-[var(--bg-page)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-3">
           

            <span className="font-heading text-3xl font-bold text-[var(--text-primary)]">
              NavQ
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#technology"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Technology
            </a>

            <a
              href="#capabilities"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Capabilities
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              How It Works
            </a>
          </nav>

          {/* CTA */}
          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-soft)] hover:text-[var(--text-primary)]"
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>

            {/* Launch Platform */}
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--accent-green)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-green-dark)] hover:shadow-md"
            >
              Launch Platform
            </Link>

          </div>

        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Left: Hero Copy */}
          <div>


            <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Smarter fleet decisions.
              <br />
              <span className="text-[var(--accent-green)]">
                Lower operational impact.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
              NavQ helps maritime operators evaluate vessel deployment,
              fuel consumption, operational cost, cargo capacity, and emissions
              through a quantum-inspired optimization engine.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/dashboard"
                className="rounded-lg bg-[var(--accent-green)] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-green-dark)] hover:shadow-md"
              >
                Launch Fleet Intelligence
              </Link>

              <a
                href="#how-it-works"
                className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-3.5 text-center text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-soft)]"
              >
                Explore How It Works
              </a>

            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[var(--text-muted)]">
              <span>✓ Fleet Optimization</span>
              <span>✓ Fuel Analysis</span>
              <span>✓ Emissions Tracking</span>
            </div>
          </div>

          {/* Right: Product Visual */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-[var(--accent-green-bg)] opacity-60 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xl">

              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-color)] px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Fleet Intelligence
                  </p>

                  <p className="mt-1 font-heading text-sm font-bold">
                    Optimization Overview
                  </p>
                </div>

                
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 p-5">

                <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Active Vessels
                  </p>

                  <p className="mt-2 font-heading text-2xl font-bold">
                    04
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Fleet Capacity
                  </p>

                  <p className="mt-2 font-heading text-2xl font-bold">
                    11,600
                  </p>

                  <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    TEU
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border-color)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Estimated Cost
                  </p>

                  <p className="mt-2 font-heading text-xl font-bold text-[var(--accent-green)]">
                    $18.3K
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border-color)] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Capacity Coverage
                  </p>

                  <p className="mt-2 font-heading text-xl font-bold text-[var(--accent-green)]">
                    100%
                  </p>
                </div>

              </div>

              {/* Optimization Flow */}
              <div className="mx-5 mb-5 rounded-xl border border-[var(--border-color)] p-4">

                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-semibold">
                    Optimization Flow
                  </p>


                </div>

                <div className="flex items-center gap-2">

                  <div className="flex-1 rounded-lg bg-[var(--bg-surface-soft)] px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold text-[var(--text-muted)]">
                      FLEET DATA
                    </p>
                  </div>

                  <span className="text-[var(--accent-green)]">
                    →
                  </span>

                  <div className="flex-1 rounded-lg bg-[var(--accent-green-bg)] px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold text-[var(--accent-green-dark)]">
                      OPTIMIZE
                    </p>
                  </div>

                  <span className="text-[var(--accent-green)]">
                    →
                  </span>

                  <div className="flex-1 rounded-lg bg-[var(--bg-surface-soft)] px-3 py-3 text-center">
                    <p className="text-[10px] font-semibold text-[var(--text-muted)]">
                      DEPLOY
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Placeholder sections */}
      <section
        id="technology"
        className="border-t border-[var(--border-color)] bg-[var(--bg-surface)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--accent-green)]">
              Technology
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Optimization designed for complex fleet decisions.
            </h2>

            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              NavQ combines fleet configuration, cargo demand, vessel
              characteristics, fuel requirements, cost, and environmental factors
              into a single optimization workflow.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                <span className="material-symbols-outlined">
                  account_tree
                </span>
              </div>

              <h3 className="mt-5 font-heading text-lg font-bold">
                Fleet Modeling
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Configure vessels using capacity and displacement data to represent
                the available fleet.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                <span className="material-symbols-outlined">
                  auto_awesome
                </span>
              </div>

              <h3 className="mt-5 font-heading text-lg font-bold">
                Quantum-Inspired Optimization
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Evaluate possible deployment configurations against operational
                constraints and target cargo demand.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                <span className="material-symbols-outlined">
                  monitoring
                </span>
              </div>

              <h3 className="mt-5 font-heading text-lg font-bold">
                Operational Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                Examine estimated cost, fuel requirements, capacity, and emissions
                for the resulting fleet plan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Container Ship Image */}
      <section className="border-t border-[var(--border-color)] bg-[var(--bg-page)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] shadow-lg">

            <img
              src="/images/container-ship.png"
              alt="Container vessel operating at sea"
              className="h-[420px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 max-w-xl p-8 lg:p-10">

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                Maritime Fleet Operations
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Optimize the fleet behind every voyage.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/80">
                NavQ connects vessel capacity, cargo demand,
                fuel requirements, operating cost, and environmental
                factors to support better fleet deployment decisions.
              </p>

            </div>

          </div>

        </div>
      </section>

      <section
        id="capabilities"
        className="border-t border-[var(--border-color)] bg-[var(--bg-page)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--accent-green)]">
              Capabilities
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              From fleet configuration to operational decisions.
            </h2>

            <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
              NavQ brings the key factors of fleet planning into one
              decision-support workflow, helping operators evaluate how vessels
              should be deployed.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {/* Capability 01 */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    directions_boat
                  </span>
                </div>

                <span className="text-lg font-semibold tracking-wider text-[var(--text-muted)]">
                  01
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Fleet Optimization
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Evaluate vessel deployment based on cargo demand, vessel capacity,
                displacement, speed, and fuel requirements.
              </p>

            </div>

            {/* Capability 02 */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    payments
                  </span>
                </div>

                <span className="text-lg font-semibold tracking-wider text-[var(--text-muted)]">
                  02
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Cost &amp; Fuel Analysis
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Estimate fuel consumption and operating costs across different
                vessel deployment configurations.
              </p>

            </div>

            {/* Capability 03 */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    co2
                  </span>
                </div>

                <span className="text-lg font-semibold tracking-wider text-[var(--text-muted)]">
                  03
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Emissions Intelligence
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Examine estimated emissions and carbon-related impact alongside
                operational and fleet planning decisions.
              </p>

            </div>

          </div>
          {/* Container Terminal Image */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-surface)]">

            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

              {/* Image */}
              <div className="relative min-h-[340px]">

                <img
                  src="/images/container-terminal.png"
                  alt="Container terminal and port operations"
                  className="absolute inset-0 h-full w-full object-cover"
                />

              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-8 lg:p-10">

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-green)]">
                  Operational Intelligence
                </p>

                <h3 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  See the bigger fleet picture.
                </h3>

                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  Evaluate how different fleet configurations affect
                  capacity, fuel consumption, operating cost, and
                  emissions before making deployment decisions.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      Fleet Planning
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Vessel deployment
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      Operational Analysis
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Cost &amp; fuel
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      Capacity
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Cargo coverage
                    </p>
                  </div>

                  <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                    <p className="text-xs text-[var(--text-muted)]">
                      Sustainability
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Emissions
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-[var(--border-color)] bg-[var(--bg-surface)]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          {/* Section Header */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--accent-green)]">
              How It Works
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Data → Optimization → Fleet Strategy
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              NavQ transforms fleet and operational data into a structured
              deployment strategy through a simple three-stage workflow.
            </p>
          </div>

          {/* Workflow */}
          <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">

            {/* Step 01 */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    database
                  </span>
                </div>

                <span className="font-heading text-lg font-bold text-[var(--text-muted)]">
                  01
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Fleet Data
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Start with the operational information that defines the available
                fleet and the demand it needs to satisfy.
              </p>

              {/* Data Inputs */}
              <div className="mt-7 space-y-2">

                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface-soft)] px-4 py-3">
                  <span className="text-xs font-medium">
                    Vessel capacity
                  </span>

                  <span className="text-xs text-[var(--text-muted)]">
                    TEU
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface-soft)] px-4 py-3">
                  <span className="text-xs font-medium">
                    Cargo demand
                  </span>

                  <span className="text-xs text-[var(--text-muted)]">
                    Target
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-[var(--bg-surface-soft)] px-4 py-3">
                  <span className="text-xs font-medium">
                    Fuel requirements
                  </span>

                  <span className="text-xs text-[var(--text-muted)]">
                    Tons
                  </span>
                </div>

              </div>
            </div>

            {/* Arrow */}
            <div className="hidden items-center justify-center lg:flex">
              <span className="material-symbols-outlined text-3xl text-[var(--accent-green)]">
                arrow_forward
              </span>
            </div>

            {/* Step 02 */}
            <div className="rounded-2xl border border-[var(--accent-green)] bg-[var(--accent-green-bg)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                </div>

                <span className="font-heading text-lg font-bold text-[var(--accent-green-dark)]">
                  02
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Optimization
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                The quantum-inspired optimization engine evaluates possible fleet
                configurations against operational constraints and demand.
              </p>

              {/* Optimization Visual */}
              <div className="mt-7 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Engine
                  </span>

                  <span className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-green)]" />
                    Processing
                  </span>
                </div>

                <div className="mt-5 space-y-2">

                  <div className="h-2 rounded-full bg-[var(--bg-surface-soft)]">
                    <div className="h-full w-[85%] rounded-full bg-[var(--accent-green)]" />
                  </div>

                  <div className="h-2 rounded-full bg-[var(--bg-surface-soft)]">
                    <div className="h-full w-[65%] rounded-full bg-[var(--accent-green)]" />
                  </div>

                  <div className="h-2 rounded-full bg-[var(--bg-surface-soft)]">
                    <div className="h-full w-[92%] rounded-full bg-[var(--accent-green)]" />
                  </div>

                </div>

              </div>
            </div>

            {/* Arrow */}
            <div className="hidden items-center justify-center lg:flex">
              <span className="material-symbols-outlined text-3xl text-[var(--accent-green)]">
                arrow_forward
              </span>
            </div>

            {/* Step 03 */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-7">

              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                  <span className="material-symbols-outlined">
                    insights
                  </span>
                </div>

                <span className="font-heading text-lg font-bold text-[var(--text-muted)]">
                  03
                </span>
              </div>

              <h3 className="mt-7 font-heading text-xl font-bold">
                Fleet Strategy
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Review the resulting deployment plan using capacity, cost, fuel,
                and environmental performance indicators.
              </p>

              {/* Result Visual */}
              <div className="mt-7 space-y-3">

                <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
                  <span className="text-xs text-[var(--text-muted)]">
                    Capacity coverage
                  </span>

                  <span className="text-sm font-bold text-[var(--accent-green)]">
                    100%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
                  <span className="text-xs text-[var(--text-muted)]">
                    Fleet vessels
                  </span>

                  <span className="text-sm font-bold">
                    04
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
                  <span className="text-xs text-[var(--text-muted)]">
                    Estimated cost
                  </span>

                  <span className="text-sm font-bold text-[var(--accent-green)]">
                    $18.3K
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Summary */}
          <div className="mt-12 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-page)] p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-semibold">
                  One workflow. Multiple operational factors.
                </p>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Turn fleet data into a deployment strategy with measurable
                  operational outcomes.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-green)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-green-dark)]"
              >
                Explore the Platform

                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>

            </div>

          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--border-color)] bg-[var(--bg-page)]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">

          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--accent-green-bg)] px-8 py-16 text-center sm:px-12">

            {/* Background decoration */}
            <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-green)] opacity-10 blur-3xl" />

            <div className="relative mx-auto max-w-3xl">

              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[var(--accent-green)]">
                Fleet Intelligence
              </p>

              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Turn fleet data into smarter decisions.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                Configure your fleet, evaluate operational performance, and explore
                optimized deployment strategies with NavQ.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-green)] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[var(--accent-green-dark)] hover:shadow-md"
                >
                  Launch Platform

                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>

                <a
                  href="#technology"
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-soft)]"
                >
                  Explore Technology
                </a>

              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

