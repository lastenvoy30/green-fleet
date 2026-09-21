import pandas as pd
import joblib
from physics_model import calculate_fuel_consumption

# load the trained model and the column structure it expects
model = joblib.load("fuel_model.pkl")
model_columns = joblib.load("model_columns.pkl")

FUEL_TYPES = ["diesel", "lng", "methanol", "ammonia", "hydrogen"]

def predict_fuel_consumption(speed_knots, displacement_tons, weather_factor, fuel_type):
    if fuel_type not in FUEL_TYPES:
        raise ValueError(f"Unknown fuel_type: {fuel_type}")

    # build a single-row input matching training data shape
    input_dict = {
        "speed_knots": speed_knots,
        "displacement_tons": displacement_tons,
        "weather_factor": weather_factor,
    }
    for ft in FUEL_TYPES:
        input_dict[f"fuel_type_{ft}"] = 1 if ft == fuel_type else 0

    input_df = pd.DataFrame([input_dict])

    # ensure column order matches what the model was trained on
    input_df = input_df.reindex(columns=model_columns, fill_value=0)

    ml_prediction = model.predict(input_df)[0]

    # also compute raw physics estimate, for comparison/debugging
    physics_estimate = calculate_fuel_consumption(speed_knots, displacement_tons, weather_factor)

    return {
        "fuel_consumed_tons": round(float(ml_prediction), 2),
        "physics_baseline_tons": physics_estimate,
        "fuel_type": fuel_type,
    }

if __name__ == "__main__":
    result = predict_fuel_consumption(
        speed_knots=16,
        displacement_tons=50000,
        weather_factor=1.05,
        fuel_type="methanol"
    )
    print(result)


    print(predict_fuel_consumption(speed_knots=20, displacement_tons=70000, weather_factor=1.2, fuel_type="hydrogen"))
print(predict_fuel_consumption(speed_knots=12, displacement_tons=25000, weather_factor=0.98, fuel_type="diesel"))