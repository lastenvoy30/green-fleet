from predict import predict_fuel_consumption
from cost_data import FUEL_PRICE_PER_TON_USD, EMISSION_FACTOR, EU_ETS_PRICE_PER_TON_CO2_EUR

def evaluate_option(speed_knots, displacement_tons, weather_factor, fuel_type):
    prediction = predict_fuel_consumption(speed_knots, displacement_tons, weather_factor, fuel_type)
    fuel_tons = prediction["fuel_consumed_tons"]

    fuel_cost_usd = fuel_tons * FUEL_PRICE_PER_TON_USD[fuel_type]
    emissions_tons = fuel_tons * EMISSION_FACTOR[fuel_type]
    carbon_tax_eur = emissions_tons * EU_ETS_PRICE_PER_TON_CO2_EUR

    # combine into one score to minimize (lower is better)
    # rough USD/EUR treated as roughly equal for MVP simplicity
    total_score = fuel_cost_usd + carbon_tax_eur

    return {
        "speed_knots": speed_knots,
        "fuel_type": fuel_type,
        "fuel_tons": fuel_tons,
        "fuel_cost_usd": round(fuel_cost_usd, 2),
        "emissions_tons": round(emissions_tons, 2),
        "carbon_tax_eur": round(carbon_tax_eur, 2),
        "total_score": round(total_score, 2),
    }

import random

SPEED_OPTIONS = [10, 12, 14, 16, 18, 20, 22]
FUEL_OPTIONS = ["diesel", "lng", "methanol", "ammonia", "hydrogen"]

def initialize_probabilities():
    # start with equal probability across all options (like superposition)
    speed_probs = {s: 1 / len(SPEED_OPTIONS) for s in SPEED_OPTIONS}
    fuel_probs = {f: 1 / len(FUEL_OPTIONS) for f in FUEL_OPTIONS}
    return speed_probs, fuel_probs

def sample_choice(prob_dict):
    options = list(prob_dict.keys())
    weights = list(prob_dict.values())
    return random.choices(options, weights=weights, k=1)[0]

def update_probabilities(prob_dict, best_choice, learning_rate=0.15):
    # "rotation gate" inspired update: nudge probability mass
    # toward the best-performing choice found this generation
    for key in prob_dict:
        if key == best_choice:
            prob_dict[key] += learning_rate * (1 - prob_dict[key])
        else:
            prob_dict[key] -= learning_rate * prob_dict[key]

    # renormalize so probabilities sum to 1
    total = sum(prob_dict.values())
    for key in prob_dict:
        prob_dict[key] /= total

    return prob_dict

def quantum_inspired_optimize(displacement_tons, weather_factor, population_size=10, generations=15):
    speed_probs, fuel_probs = initialize_probabilities()
    best_overall = None

    for gen in range(generations):
        population = []
        for _ in range(population_size):
            speed = sample_choice(speed_probs)
            fuel = sample_choice(fuel_probs)
            result = evaluate_option(speed, displacement_tons, weather_factor, fuel)
            population.append(result)

        # find the best (lowest total_score) in this generation
        best_in_gen = min(population, key=lambda x: x["total_score"])

        if best_overall is None or best_in_gen["total_score"] < best_overall["total_score"]:
            best_overall = best_in_gen

        # nudge probabilities toward the best choices found this generation
        speed_probs = update_probabilities(speed_probs, best_in_gen["speed_knots"])
        fuel_probs = update_probabilities(fuel_probs, best_in_gen["fuel_type"])

    return best_overall

if __name__ == "__main__":
    result = quantum_inspired_optimize(displacement_tons=50000, weather_factor=1.05)
    print("Best plan found:", result)