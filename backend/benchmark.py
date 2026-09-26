import time
import random
import statistics
from fleet_optimizer import quantum_inspired_fleet_optimize
from baseline_methods import standard_ga_optimize, rule_based_assignment


def run_multiple(method_fn, fleet, cargo_demand_teu, n_runs=5):
    costs = []
    times = []

    for i in range(n_runs):
        start = time.time()
        result = method_fn(fleet, cargo_demand_teu)
        elapsed = time.time() - start

        costs.append(result["total_cost"])
        times.append(elapsed)

    return {
        "avg_cost": round(statistics.mean(costs), 2),
        "min_cost": round(min(costs), 2),
        "max_cost": round(max(costs), 2),
        "std_dev_cost": round(statistics.stdev(costs), 2) if len(costs) > 1 else 0,
        "avg_time_sec": round(statistics.mean(times), 4),
        "all_costs": costs,
    }


def run_benchmark(fleet, cargo_demand_teu, n_runs=5):
    print(f"Running each method {n_runs} times...\n")

    quantum_stats = run_multiple(quantum_inspired_fleet_optimize, fleet, cargo_demand_teu, n_runs)
    ga_stats = run_multiple(standard_ga_optimize, fleet, cargo_demand_teu, n_runs)
    rule_stats = run_multiple(rule_based_assignment, fleet, cargo_demand_teu, n_runs=1)

    return {
        "quantum_inspired": quantum_stats,
        "standard_ga": ga_stats,
        "rule_based": rule_stats,
    }


if __name__ == "__main__":
    from vessel_data import FLEET, CARGO_DEMAND_TEU
    results = run_benchmark(FLEET, CARGO_DEMAND_TEU, n_runs=5)
    print(results)


if __name__ == "__main__":
    run_benchmark(n_runs=5)