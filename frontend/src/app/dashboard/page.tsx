"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type Vessel = {
  id: string;
  displacement_tons: number;
  capacity_teu: number;
};

type FleetResponse = {
  fleet: Vessel[];
  cargo_demand_teu: number;
};

type VesselPlan = {
  vessel_id: string;
  speed_knots: number;
  fuel_type: string;
  fuel_tons: number;
  usable_capacity_teu: number;
  total_score: number;
};

type OptimizeResponse = {
  vessel_plans: VesselPlan[];
  total_cost: number;
  total_fuel_cost_usd: number;
  total_carbon_tax_eur: number;
  total_emissions_tons: number;
  total_capacity_teu: number;
  demand_met: boolean;
  fitness_score: number;
};

type BenchmarkStats = {
  avg_cost: number;
  min_cost: number;
  max_cost: number;
  std_dev_cost: number;
  avg_time_sec: number;
  all_costs: number[];
};

type BenchmarkResponse = {
  quantum_inspired: BenchmarkStats;
  standard_ga: BenchmarkStats;
  rule_based: BenchmarkStats;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // editable fleet state
  const [fleet, setFleet] = useState<Vessel[]>([]);
  const [cargoDemand, setCargoDemand] = useState<number>(0);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResponse | null>(
    null,
  );

  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] =
    useState<BenchmarkResponse | null>(null);

  // load a starting default fleet once, so the form isn't empty on first load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/fleet")
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data: FleetResponse) => {
        setFleet(data.fleet);
        setCargoDemand(data.cargo_demand_teu);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateVessel = (index: number, field: keyof Vessel, value: string) => {
    const updated = [...fleet];
    if (field === "id") {
      updated[index].id = value;
    } else {
      updated[index][field] = Number(value) || 0;
    }
    setFleet(updated);
  };

  const addVessel = () => {
    setFleet([
      ...fleet,
      {
        id: `V${fleet.length + 1}`,
        displacement_tons: 30000,
        capacity_teu: 2000,
      },
    ]);
  };

  const removeVessel = (index: number) => {
    setFleet(fleet.filter((_, i) => i !== index));
  };

  const runOptimizer = () => {
    setOptimizing(true);
    fetch("http://127.0.0.1:8000/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fleet, cargo_demand_teu: cargoDemand }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data: OptimizeResponse) => {
        setOptimizeResult(data);
        setOptimizing(false);
      })
      .catch((err) => {
        setError(err.message);
        setOptimizing(false);
      });
  };

  const runBenchmark = () => {
    setBenchmarking(true);
    fetch("http://127.0.0.1:8000/benchmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fleet, cargo_demand_teu: cargoDemand }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data: BenchmarkResponse) => {
        setBenchmarkResult(data);
        setBenchmarking(false);
      })
      .catch((err) => {
        setError(err.message);
        setBenchmarking(false);
      });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[var(--border-color)] border-t-[var(--accent-green)] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-heading font-semibold text-lg">
            Loading Fleet Intelligence...
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Connecting to NavQ services
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[var(--danger-bg)] text-[var(--danger-text)] flex items-center justify-center font-bold mb-4">
            !
          </div>

          <h2 className="font-heading text-xl font-bold mb-2">
            Unable to connect
          </h2>

          <p className="text-sm text-[var(--text-secondary)] mb-4">
            NavQ could not connect to the backend service.
          </p>

          <div className="bg-[var(--bg-surface-soft)] border border-[var(--border-color)] rounded-lg p-3 text-sm text-[var(--text-secondary)] break-words">
            {error}
          </div>
        </div>
      </div>
    );

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-8 pb-12">
      <main className="space-y-10">
        <section className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-3xl">

              

              <h2 className="font-heading text-4xl font-bold tracking-tight text-[var(--text-primary)] lg:text-5xl">
                Fleet Intelligence Platform
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)] lg:text-base">
                Configure fleet capacity, evaluate vessel performance, and optimize
                deployment using the quantum-inspired optimization engine.
              </p>

            </div>

            <button
              onClick={runOptimizer}
              disabled={optimizing || fleet.length === 0}
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-green)] px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-green-dark)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {optimizing ? "Optimizing Fleet..." : "Optimize Fleet"}
            </button>

          </div>

          {/* Cargo demand input */}
          <div className="card-surface max-w-xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Planning Input
                </p>

                <label className="mt-1 block font-heading text-lg font-bold text-[var(--text-primary)]">
                  Target Cargo Demand
                </label>
              </div>

              <span className="rounded-md bg-[var(--accent-green-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-green-dark)]">
                TEU
              </span>
            </div>

            <input
              type="number"
              value={cargoDemand}
              onChange={(e) => setCargoDemand(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-soft)] px-4 py-3 text-xl font-bold text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-green)]"
            />

            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Total container demand that the optimized fleet deployment should satisfy.
            </p>
          </div>

          {/* Fleet overview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Active Vessels
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-[var(--text-primary)]">
                {fleet.length}
              </p>

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Vessels currently configured
              </p>
            </div>

            <div className="card-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Fleet Capacity
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-[var(--text-primary)]">
                {fleet
                  .reduce((total, vessel) => total + vessel.capacity_teu, 0)
                  .toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Total available TEU
              </p>
            </div>

            <div className="card-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Capacity Coverage
              </p>

              <p className="mt-2 font-heading text-2xl font-bold text-[var(--accent-green)]">
                {cargoDemand > 0
                  ? `${Math.min(
                    100,
                    (fleet.reduce(
                      (total, vessel) => total + vessel.capacity_teu,
                      0,
                    ) /
                      cargoDemand) *
                    100,
                  ).toFixed(0)}%`
                  : "—"}
              </p>

              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Fleet capacity vs. target demand
              </p>
            </div>
          </div>

          {/* Editable fleet */}
          <div className="border-t border-[var(--border-color)] pt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
              <div>
                <p className="text-[15px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-green)]">
                  Fleet Configuration
                </p>

                <h3 className="mt-1 font-heading text-xl font-bold text-[var(--text-primary)]">
                  Fleet Roster
                </h3>

                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Configure vessel capacity and displacement before optimization.
                </p>
              </div>

              <button
                onClick={addVessel}
                className="self-start rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--accent-green)] shadow-sm transition-colors hover:bg-[var(--bg-page)] sm:self-auto"
              >
                + Add Vessel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {fleet.map((v, index) => (
              <div
                key={index}
                className="card-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      Vessel
                    </p>

                    <input
                      value={v.id}
                      onChange={(e) =>
                        updateVessel(index, "id", e.target.value)
                      }
                      className="mt-1 w-24 border-b border-transparent bg-transparent font-heading text-lg font-bold text-[var(--text-primary)] outline-none transition-colors hover:border-[var(--border-color)] focus:border-[var(--accent-green)]"
                    />
                  </div>

                  <button
                    onClick={() => removeVessel(index)}
                    className="rounded-md px-2 py-1 text-xs font-semibold text-[var(--danger-text)] transition-colors hover:bg-[var(--danger-bg)]"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    Displacement
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      value={v.displacement_tons}
                      onChange={(e) =>
                        updateVessel(index, "displacement_tons", e.target.value)
                      }
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-soft)] px-4 py-3.5 text-2xl font-bold text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/10"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)]">
                      tons
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    Cargo Capacity
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      value={v.capacity_teu}
                      onChange={(e) =>
                        updateVessel(index, "capacity_teu", e.target.value)
                      }
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-soft)] px-3 py-2.5 pr-14 text-sm font-semibold text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-green)]"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)]">
                      TEU
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {fleet.length === 0 && (
            <div className="card-surface mt-4 flex flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                +
              </div>

              <h4 className="font-heading text-base font-bold text-[var(--text-primary)]">
                No vessels configured
              </h4>

              <p className="mt-1 max-w-sm text-sm text-[var(--text-secondary)]">
                Add at least one vessel to configure the fleet and run the optimizer.
              </p>
            </div>
          )}
        </section>

        {optimizeResult && (
          <section className="space-y-8 border-t border-[var(--border-color)] pt-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-green)]">
                Optimization Output
              </p>

              <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)] lg:text-3xl">
                Optimization Results
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Recommended vessel deployment and estimated environmental impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="card-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Voyage Cost
                </p>

                <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  ${optimizeResult.total_fuel_cost_usd.toLocaleString()}
                </p>

                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  Estimated fuel expenditure
                </p>
              </div>

              <div className="card-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Carbon Tax
                </p>

                <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--accent-blue)]">
                  €{optimizeResult.total_carbon_tax_eur.toLocaleString()}
                </p>

                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  EU ETS estimated liability
                </p>
              </div>

              <div className="card-surface p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Lifecycle Emissions
                </p>

                <p className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                  {optimizeResult.total_emissions_tons.toLocaleString()}
                  <span className="ml-1 text-sm font-medium text-[var(--text-secondary)]">
                    t CO₂
                  </span>
                </p>

                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  Estimated total emissions
                </p>
              </div>
            </div>

            <div className="card-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Deployment Capacity
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                      {optimizeResult.total_capacity_teu.toLocaleString()}
                    </span>

                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      TEU
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Total usable capacity across the optimized fleet.
                  </p>
                </div>

                <div
                  className={
                    optimizeResult.demand_met
                      ? "rounded-lg border border-[var(--accent-green)]/30 bg-[var(--accent-green-bg)] px-4 py-3"
                      : "rounded-lg border border-[var(--danger-text)]/30 bg-[var(--danger-bg)] px-4 py-3"
                  }
                >
                  <p
                    className={
                      optimizeResult.demand_met
                        ? "text-xs font-semibold uppercase tracking-wider text-[var(--accent-green-dark)]"
                        : "text-xs font-semibold uppercase tracking-wider text-[var(--danger-text)]"
                    }
                  >
                    {optimizeResult.demand_met
                      ? "Demand Fulfilled"
                      : "Deficit Detected"}
                  </p>

                  <p
                    className={
                      optimizeResult.demand_met
                        ? "mt-1 text-sm font-medium text-[var(--accent-green-dark)]"
                        : "mt-1 text-sm font-medium text-[var(--danger-text)]"
                    }
                  >
                    {optimizeResult.demand_met
                      ? "Fleet capacity meets the target."
                      : "Fleet capacity does not meet the target."}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {optimizeResult.vessel_plans.map((plan, index) => (
                <div
                  key={plan.vessel_id}
                  className="group overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Vessel header */}
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-sm font-bold text-[var(--accent-green)]">
                        {index + 1}
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                          Vessel
                        </p>

                        <h3 className="mt-0.5 font-heading text-xl font-bold text-[var(--text-primary)]">
                          {plan.vessel_id}
                        </h3>
                      </div>
                    </div>

                    <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {plan.fuel_type}
                    </span>
                  </div>

                  {/* Main metrics */}
                  <div className="grid grid-cols-2 gap-3 p-5">
                    <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        Target Speed
                      </p>

                      <p className="mt-2 font-heading text-xl font-bold text-[var(--text-primary)]">
                        {plan.speed_knots}
                        <span className="ml-1 text-xs font-medium text-[var(--text-secondary)]">
                          knots
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl bg-[var(--bg-surface-soft)] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        Fuel Load
                      </p>

                      <p className="mt-2 font-heading text-xl font-bold text-[var(--text-primary)]">
                        {plan.fuel_tons}
                        <span className="ml-1 text-xs font-medium text-[var(--text-secondary)]">
                          tons
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="mx-5 mb-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          Leg Cost
                        </p>

                        <p className="mt-1 font-heading text-2xl font-bold tracking-tight text-[var(--accent-green)]">
                          ${plan.total_score.toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          Deployment
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                          Optimized
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6 border-t border-[var(--border-color)] pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-base font-semibold uppercase tracking-[0.14em] text-[var(--accent-green)]">
                Performance Analysis
              </p>

              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Algorithm Telemetry
              </h2>

              <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                Compare the quantum-inspired optimizer against classical baseline
                approaches.
              </p>
            </div>

            <button
              onClick={runBenchmark}
              disabled={benchmarking || fleet.length === 0}
              className="self-start rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-green)] shadow-sm transition-colors hover:bg-[var(--bg-page)] disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
            >
              {benchmarking ? "Simulating..." : "Run Benchmark"}
            </button>
          </div>

          {benchmarkResult && (
            <div className="card-surface p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                    Cost Benchmark
                  </p>

                  <h3 className="mt-1 font-heading text-lg font-bold text-[var(--text-primary)]">
                    Average Cost Comparison
                  </h3>
                </div>

                <p className="text-xs text-[var(--text-secondary)]">
                  Lower cost indicates a more economical result
                </p>
              </div>
              <div className="h-[340px] sm:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Quantum-Inspired",
                        cost: benchmarkResult.quantum_inspired.avg_cost,
                      },
                      {
                        name: "Standard GA",
                        cost: benchmarkResult.standard_ga.avg_cost,
                      },
                      {
                        name: "Rule-Based",
                        cost: benchmarkResult.rule_based.avg_cost,
                      },
                    ]}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="var(--text-secondary)"
                      tick={{
                        fill: "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="var(--text-secondary)"
                      tick={{
                        fill: "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{
                        fill: "var(--accent-green-bg)",
                        opacity: 0.4,
                      }}
                      contentStyle={{
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "10px",
                        color: "var(--text-primary)",
                      }}
                      formatter={(value: unknown) => [
                        `$${Number(
                          Array.isArray(value) ? value[0] : (value ?? 0),
                        ).toLocaleString()}`,
                        "Avg Cost",
                      ]}
                    />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                      {[
                        benchmarkResult.quantum_inspired.avg_cost,
                        benchmarkResult.standard_ga.avg_cost,
                        benchmarkResult.rule_based.avg_cost,
                      ].map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? "var(--accent-green)"
                              : "var(--text-muted)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )
          }
        </section >
      </main >
    </div >
  );
}
