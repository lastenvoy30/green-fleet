from fastapi import FastAPI

app = FastAPI()

@app.get("/predict")
def predict_stub():
    return {
        "fuel_consumed_tons": 42.5,
        "co2_emissions_tons": 132.1,
        "fuel_type": "diesel"
    }

@app.get("/optimize")
def optimize_stub():
    return {
        "recommended_plan": [
            {"vessel_id": "V1", "fuel_type": "methanol", "speed_knots": 14.5}
        ],
        "total_cost_usd": 250000,
        "carbon_tax_avoided_eur": 400000,
        "cii_grade": "B"
    }