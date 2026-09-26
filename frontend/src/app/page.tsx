"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

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

let nextVesselNum = 1;

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // editable fleet state
  const [fleet, setFleet] = useState<Vessel[]>([]);
  const [cargoDemand, setCargoDemand] = useState<number>(0);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResponse | null>(null);

  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResponse | null>(null);

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
        nextVesselNum = data.fleet.length + 1;
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
      { id: `V${nextVesselNum}`, displacement_tons: 30000, capacity_teu: 2000 },
    ]);
    nextVesselNum += 1;
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
      <nav className="border-b border-[#bdcac0] bg-[#ffffff] px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#006c48] flex items-center justify-center text-white font-bold tracking-tight">GQ</div>
            <h1 className="text-xl font-bold font-heading tracking-tight text-[#0e1f19]">
              GreenQuanta <span className="text-[#6e7a72] font-normal">| Fleet Optimizer</span>
            </h1>
          </div>
          <span className="bg-[#def3e9] text-[#006946] border border-[#bdcac0]/40 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16845b] animate-pulse"></span>
            System Online
          </span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-10">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#006946] font-bold px-2.5 py-1 rounded bg-[#def3e9] border border-[#bdcac0]/40">
                Maritime Dispatch Directive
              </span>
              <h2 className="text-3xl font-bold font-heading text-[#0e1f19] mt-3">Route Deployment</h2>
            </div>
            <button
              onClick={runOptimizer}
              disabled={optimizing || fleet.length === 0}
              className="bg-[#16845b] hover:bg-[#006946] text-[#ffffff] font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {optimizing ? "Running QIGA Optimizer..." : "Run Quantum-Inspired Optimizer"}
            </button>
          </div>

          {/* Cargo demand input */}
          <div className="bg-[#ffffff] border border-[#bdcac0] rounded-xl p-5 shadow-sm max-w-sm">
            <label className="text-sm font-bold uppercase tracking-wider text-[#3e4942] block mb-2">
              Target Cargo Demand (TEU)
            </label>
            <input
              type="number"
              value={cargoDemand}
              onChange={(e) => setCargoDemand(Number(e.target.value) || 0)}
              className="w-full border border-[#bdcac0] rounded-lg px-3 py-2 text-lg font-semibold text-[#0e1f19] focus:outline-none focus:border-[#16845b]"
            />
          </div>

          {/* Editable fleet */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#3e4942]">Fleet Roster</h3>
              <button
                onClick={addVessel}
                className="text-sm font-semibold text-[#006946] hover:underline"
              >
                + Add Vessel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fleet.map((v, index) => (
                <div key={index} className="bg-[#ffffff] border border-[#bdcac0] p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      value={v.id}
                      onChange={(e) => updateVessel(index, "id", e.target.value)}
                      className="font-bold text-lg text-[#0e1f19] border-b border-transparent hover:border-[#bdcac0] focus:border-[#16845b] focus:outline-none w-24"
                    />
                    <button
                      onClick={() => removeVessel(index)}
                      className="text-[#93000a] text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <label className="text-xs text-[#3e4942] block mb-1">Displacement (tons)</label>
                  <input
                    type="number"
                    value={v.displacement_tons}
                    onChange={(e) => updateVessel(index, "displacement_tons", e.target.value)}
                    className="w-full border border-[#bdcac0] rounded px-2 py-1 mb-3 text-sm"
                  />
                  <label className="text-xs text-[#3e4942] block mb-1">Capacity (TEU)</label>
                  <input
                    type="number"
                    value={v.capacity_teu}
                    onChange={(e) => updateVessel(index, "capacity_teu", e.target.value)}
                    className="w-full border border-[#bdcac0] rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>
            {fleet.length === 0 && (
              <p className="text-[#3e4942] text-sm mt-3">No vessels yet — click &quot;+ Add Vessel&quot; to start.</p>
            )}
          </div>
        </section>

        {optimizeResult && (
          <section className="space-y-6 border-t border-[#bdcac0]/60 pt-8">
            <h2 className="text-2xl font-bold font-heading text-[#0e1f19]">Optimization Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#006946]">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">Voyage Cost</p>
                <p className="text-3xl font-extrabold font-heading text-[#0e1f19] tracking-tight">
                  ${optimizeResult.total_fuel_cost_usd.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#0d6682]">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">Carbon Tax (EU ETS)</p>
                <p className="text-3xl font-extrabold font-heading text-[#0d6682] tracking-tight">
                  €{optimizeResult.total_carbon_tax_eur.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#ffffff] border border-[#bdcac0] p-6 rounded-xl shadow-sm border-l-4 border-l-[#6e7a72]">
                <p className="text-xs text-[#3e4942] uppercase tracking-wider font-bold mb-2">Lifecycle Emissions</p>
                <p className="text-3xl font-extrabold font-heading text-[#0e1f19] tracking-tight">
                  {optimizeResult.total_emissions_tons.toLocaleString()}
                  <span className="text-sm text-[#3e4942] font-medium"> t CO₂</span>
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff] border border-[#bdcac0] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
              <span className="text-[#3e4942] font-medium">
                Deployed Capacity: <strong className="text-[#0e1f19] text-lg">{optimizeResult.total_capacity_teu.toLocaleString()} TEU</strong>
              </span>
              <span className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${optimizeResult.demand_met ? 'bg-[#e4f8ee] text-[#006946] border border-[#94f6c4]' : 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]'}`}>
                {optimizeResult.demand_met ? "Demand Fulfilled" : "Deficit Detected"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {optimizeResult.vessel_plans.map((plan) => (
                <div key={plan.vessel_id} className="bg-[#ffffff] border border-[#bdcac0] p-5 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-[#0e1f19]">{plan.vessel_id}</h3>
                    <span className="px-2 py-0.5 bg-[#d3e7dd] border border-[#bdcac0]/50 text-xs rounded text-[#002113] uppercase font-bold tracking-wider">
                      {plan.fuel_type}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-[#bdcac0]/40 pb-2">
                      <span className="text-[#3e4942]">Target Speed</span>
                      <span className="font-medium text-[#0e1f19]">{plan.speed_knots} knots</span>
                    </div>
                    <div className="flex justify-between border-b border-[#bdcac0]/40 pb-2">
                      <span className="text-[#3e4942]">Fuel Load</span>
                      <span className="font-medium text-[#0e1f19]">{plan.fuel_tons} tons</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-[#3e4942]">Leg Cost</span>
                      <span className="text-[#006946] font-bold">${plan.total_score.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6 border-t border-[#bdcac0]/60 pt-8">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold font-heading text-[#0e1f19]">Algorithm Telemetry</h2>
              <p className="text-[#3e4942] mt-1 text-sm">Validate performance against standard classical baselines.</p>
            </div>
            <button
              onClick={runBenchmark}
              disabled={benchmarking || fleet.length === 0}
              className="bg-[#ffffff] hover:bg-[#e4f8ee] text-[#16845b] font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 border border-[#bdcac0] shadow-sm"
            >
              {benchmarking ? "Simulating..." : "Run Benchmark"}
            </button>
          </div>

          {benchmarkResult && (
            <div className="bg-[#ffffff] border border-[#bdcac0] rounded-xl p-6 h-[400px] shadow-sm">
              <h3 className="text-lg font-bold text-[#0e1f19] mb-6">Average Cost Comparison</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Quantum-Inspired", cost: benchmarkResult.quantum_inspired.avg_cost },
                    { name: "Standard GA", cost: benchmarkResult.standard_ga.avg_cost },
                    { name: "Rule-Based", cost: benchmarkResult.rule_based.avg_cost },
                  ]}
                  margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#bdcac0" vertical={false} />
                  <XAxis dataKey="name" stroke="#3e4942" tick={{ fill: '#3e4942', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#3e4942" tick={{ fill: '#3e4942', fontWeight: 500 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#d3e7dd', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #bdcac0', borderRadius: '8px', color: '#0e1f19' }}
                    formatter={(value: unknown) => [`$${Number(Array.isArray(value) ? value[0] : (value ?? 0)).toLocaleString()}`, 'Avg Cost']}
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {[
                      benchmarkResult.quantum_inspired.avg_cost,
                      benchmarkResult.standard_ga.avg_cost,
                      benchmarkResult.rule_based.avg_cost,
                    ].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#16845b' : '#6e7a72'} />
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