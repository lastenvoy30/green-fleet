import random
from fleet_optimizer import evaluate_vessel_choice, SPEED_OPTIONS, FUEL_OPTIONS
from vessel_data import FLEET, CARGO_DEMAND_TEU


def evaluate_fleet_random(speed_fuel_choices, fleet, cargo_demand_teu):
    vessel_results = []
    for vessel, (speed, fuel) in zip(fleet, speed_fuel_choices):
        vessel_results.append(evaluate_vessel_choice(vessel, speed, fuel))

    total_cost = sum(v["total_score"] for v in vessel_results)
    total_capacity = sum(v["usable_capacity_teu"] for v in vessel_results)
    demand_met = total_capacity >= cargo_demand_teu
    fitness_score = total_cost if demand_met else total_cost + 1_000_000

    return {
        "vessel_plans": vessel_results,
        "total_cost": round(total_cost, 2),
        "total_capacity_teu": round(total_capacity, 1),
        "demand_met": demand_met,
        "fitness_score": round(fitness_score, 2),
    }


def standard_ga_optimize(fleet, cargo_demand_teu, population_size=10, generations=20):
    def random_individual():
        return [(random.choice(SPEED_OPTIONS), random.choice(FUEL_OPTIONS)) for _ in fleet]

    def mutate(individual, rate=0.3):
        new_ind = []
        for speed, fuel in individual:
            if random.random() < rate:
                speed = random.choice(SPEED_OPTIONS)
            if random.random() < rate:
                fuel = random.choice(FUEL_OPTIONS)
            new_ind.append((speed, fuel))
        return new_ind

    population = [random_individual() for _ in range(population_size)]
    best_overall = None

    for gen in range(generations):
        evaluated = [(ind, evaluate_fleet_random(ind, fleet, cargo_demand_teu)) for ind in population]
        evaluated.sort(key=lambda x: x[1]["fitness_score"])

        best_ind, best_result = evaluated[0]
        if best_overall is None or best_result["fitness_score"] < best_overall["fitness_score"]:
            best_overall = best_result

        survivors = [ind for ind, _ in evaluated[: population_size // 2]]
        population = survivors + [mutate(random.choice(survivors)) for _ in range(population_size - len(survivors))]

    return best_overall


def rule_based_assignment(fleet, cargo_demand_teu):
    fixed_choice = [(14, "diesel") for _ in fleet]
    return evaluate_fleet_random(fixed_choice, fleet, cargo_demand_teu)


if __name__ == "__main__":
    print("Standard GA result:")
    print(standard_ga_optimize())

    print("\nRule-based result:")
    print(rule_based_assignment())