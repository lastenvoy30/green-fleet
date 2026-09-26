import random
from predict import predict_fuel_consumption
from cost_data import (
    FUEL_PRICE_PER_TON_USD,
    EMISSION_FACTOR,
    EU_ETS_PRICE_PER_TON_CO2_EUR,
    VOLUMETRIC_CARGO_PENALTY,
)
from vessel_data import FLEET, CARGO_DEMAND_TEU

SPEED_OPTIONS = [10, 12, 14, 16, 18, 20, 22]
FUEL_OPTIONS = ["diesel", "lng", "methanol", "ammonia", "hydrogen"]

def evaluate_vessel_choice(vessel, speed_knots, fuel_type, weather_factor=1.05):
    prediction = predict_fuel_consumption(
        speed_knots, vessel["displacement_tons"], weather_factor, fuel_type
    )
    fuel_tons = prediction["fuel_consumed_tons"]

    fuel_cost_usd = fuel_tons * FUEL_PRICE_PER_TON_USD[fuel_type]
    emissions_tons = fuel_tons * EMISSION_FACTOR[fuel_type]
    carbon_tax_eur = emissions_tons * EU_ETS_PRICE_PER_TON_CO2_EUR

    penalty = VOLUMETRIC_CARGO_PENALTY[fuel_type]
    usable_capacity_teu = vessel["capacity_teu"] * (1 - penalty)

    total_score = fuel_cost_usd + carbon_tax_eur

    return {
        "vessel_id": vessel["id"],
        "speed_knots": speed_knots,
        "fuel_type": fuel_type,
        "fuel_tons": round(fuel_tons, 2),
        "fuel_cost_usd": round(fuel_cost_usd, 2),
        "emissions_tons": round(emissions_tons, 2),
        "carbon_tax_eur": round(carbon_tax_eur, 2),
        "usable_capacity_teu": round(usable_capacity_teu, 1),
        "total_score": round(total_score, 2),
    }

def initialize_fleet_probabilities():
    # one probability distribution per vessel, per decision (speed, fuel)
    fleet_probs = {}
    for vessel in FLEET:
        fleet_probs[vessel["id"]] = {
            "speed": {s: 1 / len(SPEED_OPTIONS) for s in SPEED_OPTIONS},
            "fuel": {f: 1 / len(FUEL_OPTIONS) for f in FUEL_OPTIONS},
        }
    return fleet_probs

def sample_choice(prob_dict):
    options = list(prob_dict.keys())
    weights = list(prob_dict.values())
    return random.choices(options, weights=weights, k=1)[0]

def update_probabilities(prob_dict, best_choice, learning_rate=0.15):
    for key in prob_dict:
        if key == best_choice:
            prob_dict[key] += learning_rate * (1 - prob_dict[key])
        else:
            prob_dict[key] -= learning_rate * prob_dict[key]
    total = sum(prob_dict.values())
    for key in prob_dict:
        prob_dict[key] /= total
    return prob_dict

def evaluate_fleet_plan(fleet_probs, fleet, cargo_demand_teu):
    vessel_results = []
    for vessel in fleet:
        speed = sample_choice(fleet_probs[vessel["id"]]["speed"])
        fuel = sample_choice(fleet_probs[vessel["id"]]["fuel"])
        result = evaluate_vessel_choice(vessel, speed, fuel)
        vessel_results.append(result)

    total_cost = sum(v["total_score"] for v in vessel_results)
    total_fuel_cost = sum(v["fuel_cost_usd"] for v in vessel_results)
    total_carbon_tax = sum(v["carbon_tax_eur"] for v in vessel_results)
    total_emissions = sum(v["emissions_tons"] for v in vessel_results)
    total_capacity = sum(v["usable_capacity_teu"] for v in vessel_results)
    demand_met = total_capacity >= cargo_demand_teu

    fitness_score = total_cost if demand_met else total_cost + 1_000_000

    return {
        "vessel_plans": vessel_results,
        "total_cost": round(total_cost, 2),
        "total_fuel_cost_usd": round(total_fuel_cost, 2),
        "total_carbon_tax_eur": round(total_carbon_tax, 2),
        "total_emissions_tons": round(total_emissions, 2),
        "total_capacity_teu": round(total_capacity, 1),
        "demand_met": demand_met,
        "fitness_score": round(fitness_score, 2),
    }


def quantum_inspired_fleet_optimize(fleet, cargo_demand_teu, population_size=10, generations=20):
    fleet_probs = {}
    for vessel in fleet:
        fleet_probs[vessel["id"]] = {
            "speed": {s: 1 / len(SPEED_OPTIONS) for s in SPEED_OPTIONS},
            "fuel": {f: 1 / len(FUEL_OPTIONS) for f in FUEL_OPTIONS},
        }

    best_overall = None

    for gen in range(generations):
        population = [evaluate_fleet_plan(fleet_probs, fleet, cargo_demand_teu) for _ in range(population_size)]
        best_in_gen = min(population, key=lambda x: x["fitness_score"])

        if best_overall is None or best_in_gen["fitness_score"] < best_overall["fitness_score"]:
            best_overall = best_in_gen

        for v in best_in_gen["vessel_plans"]:
            vid = v["vessel_id"]
            fleet_probs[vid]["speed"] = update_probabilities(fleet_probs[vid]["speed"], v["speed_knots"])
            fleet_probs[vid]["fuel"] = update_probabilities(fleet_probs[vid]["fuel"], v["fuel_type"])

    return best_overall   


if __name__ == "__main__":
    best_plan = quantum_inspired_fleet_optimize()
    print("Demand met:", best_plan["demand_met"])
    print("Total capacity:", best_plan["total_capacity_teu"], "/ needed:", CARGO_DEMAND_TEU)
    print("Total cost:", best_plan["total_cost"])
    for v in best_plan["vessel_plans"]:
        print(v)