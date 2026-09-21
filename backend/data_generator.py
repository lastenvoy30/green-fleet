import random
import csv
from physics_model import calculate_fuel_consumption

# Fuel types and a rough multiplier representing how their consumption
# differs from diesel for the same power output (placeholder values —
# you can refine these later using the energy density table from your
# research doc)
FUEL_TYPES = {
    "diesel": 1.0,
    "lng": 0.90,
    "methanol": 1.15,
    "ammonia": 1.25,
    "hydrogen": 1.35,
}

def generate_row():
    speed = round(random.uniform(10, 22), 1)               # knots
    displacement = round(random.uniform(15000, 80000), 0)   # tons
    weather_factor = round(random.uniform(0.95, 1.3), 2)    # calm to rough
    fuel_type = random.choice(list(FUEL_TYPES.keys()))

    # baseline physics estimate
    base_fuel = calculate_fuel_consumption(speed, displacement, weather_factor)

    # apply fuel-type multiplier
    fuel_adjusted = base_fuel * FUEL_TYPES[fuel_type]

    # add noise to simulate real-world messiness:
    # hull fouling, engine degradation, sensor error etc.
    noise_factor = round(random.uniform(0.92, 1.08), 3)
    final_fuel = round(fuel_adjusted * noise_factor, 2)

    return {
        "speed_knots": speed,
        "displacement_tons": displacement,
        "weather_factor": weather_factor,
        "fuel_type": fuel_type,
        "fuel_consumed_tons": final_fuel,
    }

def generate_dataset(n_rows=5000, output_path="../data/synthetic_voyages.csv"):
    rows = [generate_row() for _ in range(n_rows)]

    with open(output_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {n_rows} rows -> {output_path}")

if __name__ == "__main__":
    generate_dataset()