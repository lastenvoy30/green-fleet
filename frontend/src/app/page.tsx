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

// --- Types ---
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
  const [fleetData, setFleetData] = useState<FleetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResponse | null>(
    null,
  );

  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] =
    useState<BenchmarkResponse | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/fleet")
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data: FleetResponse) => {
        setFleetData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const runOptimizer = () => {
    setOptimizing(true);
    fetch("http://127.0.0.1:8000/optimize")
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
    fetch("http://127.0.0.1:8000/benchmark")
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
      <div className="min-h-screen bg-[#e4f8ee] text-[#3e4942] flex items-center justify-center font-medium">
        Loading system...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#e4f8ee] text-[#ba1a1a] flex items-center justify-center font-medium">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#e4f8ee] text-[#0e1f19] font-sans pb-20 selection:bg-[#94f6c4] selection:text-[#002113]">
      {/* Top Navbar */}
      <nav className="border-b border-[#bdcac0] bg-[#ffffff] px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#006c48] flex items-center justify-center text-white font-bold tracking-tight">
              GQ
            </div>
            <h1 className="text-xl font-bold font-heading tracking-tight text-[#0e1f19]">
              GreenQuanta{" "}
              <span className="text-[#6e7a72] font-normal">
                | Fleet Optimizer
              </span>
            </h1>
          </div>
          <span className="bg-[#def3e9] text-[#006946] border border-[#bdcac0]/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16845b] animate-pulse"></span>
            System Online
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-10">
        {/* Header & Fleet Info */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#006946] font-bold px-2.5 py-1 rounded bg-[#def3e9] border border-[#bdcac0]/40">
                Maritime Dispatch Directive
              </span>
              <h2 className="text-3xl font-bold font-heading text-[#0e1f19] mt-3">
                Route Deployment
              </h2>
              <p className="text-[#3e4942] mt-1 text-sm">
                Target Cargo Demand:{" "}
                <span className="font-semibold text-[#0e1f19]">
                  {fleetData?.cargo_demand_teu.toLocaleString()} TEU
                </span>
              </p>
            </div>
            <button
              onClick={runOptimizer}
              disabled={optimizing}
              className="bg-[#16845b] hover:bg-[#006946] text-[#ffffff] font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {optimizing
                ? "Running QIGA Optimizer..."
                : "Run Quantum-Inspired Optimizer"}
            </button>
          </div>

          {/* Fleet Grid */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#3e4942] mb-3">
              Available Fleet Roster
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fleetData?.fleet.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#ffffff] border border-[#bdcac0] p-5 rounded-xl shadow-sm hover:border-[#78d9aa] transition-colors"
                >
                  <h3 className="font-bold text-lg text-[#0e1f19]">{v.id}</h3>
                  <div className="flex justify-between mt-3 text-sm text-[#3e4942]">
                    <span>Displacement:</span>
                    <span className="font-medium text-[#0e1f19]">
                      {v.displacement_tons.toLocaleString()} t
                    </span>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-[#3e4942]">
                    <span>Capacity:</span>
                    <span className="font-medium text-[#0e1f19]">
                      {v.capacity_teu.toLocaleString()} TEU
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {optimizeResult && (
          <section className="space-y-6 animate-in fade-in duration-500 border-t border-[#bdcac0]/60 pt-8">
            <h2 className="text-2xl font-bold text-[#0e1f19]">
              Optimization Results
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#006946] flex flex-col justify-between">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">
                  Voyage Cost
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold font-heading text-[#0e1f19] tracking-tight">
                    ${optimizeResult.total_fuel_cost_usd.toLocaleString()}
                  </p>{" "}
                  <p className="text-sm text-[#3e4942]">USD</p>
                </div>
              </div>

              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#0d6682] flex flex-col justify-between">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">
                  Carbon Tax (EU ETS)
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-[#0d6682] tracking-tight">
                    €{optimizeResult.total_carbon_tax_eur.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#3e4942]">EUR</p>
                </div>
              </div>

              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#6e7a72] flex flex-col justify-between">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">
                  Lifecycle Emissions
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-[#0e1f19] tracking-tight">
                    {optimizeResult.total_emissions_tons.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#3e4942] font-medium">t CO₂</p>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-[#ffffff] border border-[#bdcac0] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <span className="text-[#3e4942] font-medium">
                Deployed Capacity:{" "}
                <strong className="text-[#0e1f19] text-lg">
                  {optimizeResult.total_capacity_teu.toLocaleString()} TEU
                </strong>
              </span>
              <span
                className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${optimizeResult.demand_met ? "bg-[#e4f8ee] text-[#006946] border border-[#94f6c4]" : "bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]"}`}
              >
                {optimizeResult.demand_met
                  ? "Demand Fulfilled"
                  : "Deficit Detected"}
              </span>
            </div>

            {/* Vessel Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {optimizeResult.vessel_plans.map((plan) => (
                <div
                  key={plan.vessel_id}
                  className="bg-[#ffffff] border border-[#bdcac0] p-5 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#0e1f19]">
                      {plan.vessel_id}
                    </h3>
                    <span className="px-2 py-0.5 bg-[#d3e7dd] border border-[#bdcac0]/50 text-xs rounded text-[#002113] uppercase font-bold tracking-wider">
                      {plan.fuel_type}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-[#bdcac0]/40 pb-2">
                      <span className="text-[#3e4942]">Target Speed</span>
                      <span className="font-medium text-[#0e1f19]">
                        {plan.speed_knots} knots
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#bdcac0]/40 pb-2">
                      <span className="text-[#3e4942]">Fuel Load</span>
                      <span className="font-medium text-[#0e1f19]">
                        {plan.fuel_tons} tons
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-[#3e4942]">Leg Cost</span>
                      <span className="text-[#006946] font-bold">
                        ${plan.total_score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Benchmark Section */}
        <section className="space-y-6 border-t border-[#bdcac0]/60 pt-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-[#0e1f19]">
                Algorithm Telemetry
              </h2>
              <p className="text-[#3e4942] mt-1 text-sm">
                Validate performance against standard classical baselines.
              </p>
            </div>
            <button
              onClick={runBenchmark}
              disabled={benchmarking}
              className="bg-[#ffffff] hover:bg-[#e4f8ee] text-[#16845b] font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 border border-[#bdcac0] shadow-sm"
            >
              {benchmarking ? "Simulating..." : "Run Benchmark"}
            </button>
          </div>

          {benchmarkResult && (
            <div className="bg-[#ffffff] border border-[#bdcac0] rounded-xl p-6 h-[400px] shadow-sm">
              <h3 className="text-lg font-bold text-[#0e1f19] mb-6">
                Average Cost Comparison
              </h3>
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
                    stroke="#bdcac0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#3e4942"
                    tick={{ fill: "#3e4942", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#3e4942"
                    tick={{ fill: "#3e4942", fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "#d3e7dd", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #bdcac0",
                      borderRadius: "8px",
                      color: "#0e1f19",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    itemStyle={{ color: "#006946", fontWeight: "bold" }}
                    formatter={(value: unknown) => [
                      `$${Number(Array.isArray(value) ? value[0] : (value ?? 0)).toLocaleString()}`,
                      "Avg Cost",
                    ]}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {[
                      benchmarkResult.quantum_inspired.avg_cost,
                      benchmarkResult.standard_ga.avg_cost,
                      benchmarkResult.rule_based.avg_cost,
                    ].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#16845b" : "#6e7a72"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
