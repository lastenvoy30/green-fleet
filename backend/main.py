from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from predict import predict_fuel_consumption
from fleet_optimizer import quantum_inspired_fleet_optimize, CARGO_DEMAND_TEU, FLEET
from fastapi.middleware.cors import CORSMiddleware
from benchmark import run_benchmark
from pydantic import BaseModel


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    speed_knots: float
    displacement_tons: float
    weather_factor: float
    fuel_type: str

@app.post("/predict")
def predict(req: PredictRequest):
    try:
        result = predict_fuel_consumption(
            speed_knots=req.speed_knots,
            displacement_tons=req.displacement_tons,
            weather_factor=req.weather_factor,
            fuel_type=req.fuel_type,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


class VesselInput(BaseModel):
    id: str
    displacement_tons: float
    capacity_teu: float

class OptimizeRequest(BaseModel):
    fleet: list[VesselInput]
    cargo_demand_teu: float

@app.post("/optimize")
def optimize(req: OptimizeRequest):
    fleet = [v.dict() for v in req.fleet]
    best_plan = quantum_inspired_fleet_optimize(fleet, req.cargo_demand_teu)
    return best_plan

@app.get("/fleet")
def get_fleet():
    return {
        "fleet": FLEET,
        "cargo_demand_teu": CARGO_DEMAND_TEU,
    }

@app.post("/benchmark")
def benchmark(req: OptimizeRequest):
    fleet = [v.dict() for v in req.fleet]
    results = run_benchmark(fleet, req.cargo_demand_teu, n_runs=5)
    return results