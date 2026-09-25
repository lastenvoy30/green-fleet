import time
import random
import statistics
from fleet_optimizer import quantum_inspired_fleet_optimize
from baseline_methods import standard_ga_optimize, rule_based_assignment


def run_multiple(method_fn, n_runs=5):
    costs = []
    times = []

    for i in range(n_runs):
        print(f"[debug] run {i}, random check: {random.random()}")
        start = time.time()
        result = method_fn()
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


def run_benchmark(n_runs=5):
    print(f"Running each method {n_runs} times...\n")

    print("Quantum-Inspired Optimizer (QIGA/QPSO)...")
    print(f"[debug] random check before quantum runs: {random.random()}")
    quantum_stats = run_multiple(quantum_inspired_fleet_optimize, n_runs)

    print("Standard GA...")
    ga_stats = run_multiple(standard_ga_optimize, n_runs)

    print("Rule-Based (no search)...")
    rule_stats = run_multiple(rule_based_assignment, n_runs=1)

    results = {
        "quantum_inspired": quantum_stats,
        "standard_ga": ga_stats,
        "rule_based": rule_stats,
    }

    print("\n===== BENCHMARK RESULTS =====")
    for method, stats in results.items():
        print(f"\n{method}:")
        print(f"  avg cost: {stats['avg_cost']}")
        print(f"  min/max cost: {stats['min_cost']} / {stats['max_cost']}")
        print(f"  std dev: {stats['std_dev_cost']}")
        print(f"  avg time (sec): {stats['avg_time_sec']}")

    return results


if __name__ == "__main__":
    run_benchmark(n_runs=5)