"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [fleetData, setFleetData] = useState<FleetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [optimizing, setOptimizing] = useState(false);
  const [optimizeResult, setOptimizeResult] = useState<OptimizeResponse | null>(null);

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
    setOptimizeResult(null);

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

  if (loading) return <main className="p-8">Loading fleet data...</main>;
  if (error) return <main className="p-8 text-red-500">Error: {error}</main>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Green Fleet Dashboard</h1>
      <p className="mb-4">Cargo demand: {fleetData?.cargo_demand_teu} TEU</p>

      <div className="space-y-2 mb-6">
        {fleetData?.fleet.map((vessel) => (
          <div key={vessel.id} className="border p-3 rounded">
            <p className="font-semibold">{vessel.id}</p>
            <p>Displacement: {vessel.displacement_tons} tons</p>
            <p>Capacity: {vessel.capacity_teu} TEU</p>
          </div>
        ))}
      </div>

      <button
        onClick={runOptimizer}
        disabled={optimizing}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {optimizing ? "Optimizing..." : "Run Quantum-Inspired Optimizer"}
      </button>

      {optimizeResult && (
  <div className="mt-6">
    <h2 className="text-xl font-bold mb-4">Optimized Plan</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Voyage Cost</p>
        <p className="text-2xl font-bold text-green-700">
          ${optimizeResult.total_fuel_cost_usd.toLocaleString()}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Carbon Tax (EU ETS)</p>
        <p className="text-2xl font-bold text-blue-700">
          €{optimizeResult.total_carbon_tax_eur.toLocaleString()}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Emissions</p>
        <p className="text-2xl font-bold text-gray-700">
          {optimizeResult.total_emissions_tons.toLocaleString()} tons CO₂
        </p>
      </div>
    </div>

    <p className="mb-2">Total capacity: {optimizeResult.total_capacity_teu} TEU</p>
    <p className="mb-4">Demand met: {optimizeResult.demand_met ? "Yes" : "No"}</p>

          <div className="space-y-2 mt-4">
            {optimizeResult.vessel_plans.map((plan) => (
              <div key={plan.vessel_id} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold">{plan.vessel_id}</p>
                <p>Speed: {plan.speed_knots} knots</p>
                <p>Fuel: {plan.fuel_type}</p>
                <p>Fuel used: {plan.fuel_tons} tons</p>
                <p>Cost: ${plan.total_score}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}