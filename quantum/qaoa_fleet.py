from qiskit_optimization import QuadraticProgram
from qiskit_optimization.converters import QuadraticProgramToQubo
from qiskit_optimization.algorithms import MinimumEigenOptimizer
from qiskit_algorithms import QAOA, NumPyMinimumEigensolver
from qiskit_algorithms.optimizers import COBYLA
from qiskit.primitives import Sampler
# ---- Toy fleet: 4 vessels, binary fuel choice (0 = diesel, 1 = LNG) ----
VESSELS = [
    {"id": "V1", "capacity_teu": 40, "lng_capacity_loss": 5, "cost_diesel": 3200, "cost_lng": 2700},
    {"id": "V2", "capacity_teu": 52, "lng_capacity_loss": 6, "cost_diesel": 4100, "cost_lng": 3500},
    {"id": "V3", "capacity_teu": 24, "lng_capacity_loss": 4, "cost_diesel": 2000, "cost_lng": 1650},
    {"id": "V4", "capacity_teu": 30, "lng_capacity_loss": 5, "cost_diesel": 2450, "cost_lng": 2000},
]
CARGO_DEMAND_TEU = 128

def build_problem():
    qp = QuadraticProgram(name="fleet_fuel_choice")
    for v in VESSELS:
        qp.binary_var(name=v["id"])

    # Objective: minimize total cost.
    # cost_i = cost_diesel_i + (cost_lng_i - cost_diesel_i) * x_i
    linear_obj = {v["id"]: (v["cost_lng"] - v["cost_diesel"]) for v in VESSELS}
    constant_obj = sum(v["cost_diesel"] for v in VESSELS)
    qp.minimize(constant=constant_obj, linear=linear_obj)

    # Constraint: total usable capacity must meet cargo demand.
    # usable_capacity_i = capacity_i * (1 - LNG_CAPACITY_PENALTY * x_i)
    # sum(usable_capacity_i) >= CARGO_DEMAND_TEU
    linear_constraint = {v["id"]: -v["lng_capacity_loss"] for v in VESSELS}
    rhs = CARGO_DEMAND_TEU - sum(v["capacity_teu"] for v in VESSELS)
    qp.linear_constraint(linear=linear_constraint, sense=">=", rhs=rhs, name="cargo_demand")

    return qp


def solve_exact(qp):
    """Classical exact solver — the ground-truth answer for this tiny problem."""
    solver = MinimumEigenOptimizer(NumPyMinimumEigensolver())
    return solver.solve(qp)


def solve_qaoa(qp):
    """Real quantum algorithm (QAOA) solving the same problem."""
    def progress_callback(eval_count, params, mean, std):
        print(f"  iteration {eval_count}: current best cost = {mean:.2f}", flush=True)

    qaoa = QAOA(sampler=Sampler(), optimizer=COBYLA(maxiter=100), reps=2)
    solver = MinimumEigenOptimizer(qaoa)
    return solver.solve(qp)


if __name__ == "__main__":
    qp = build_problem()
    qubo = QuadraticProgramToQubo().convert(qp)  # sanity conversion, not used directly below
    print(f"Number of qubits in QUBO: {qubo.get_num_binary_vars()}")
    print("Solving exactly (classical, ground truth)...")
    exact_result = solve_exact(qp)
    print(exact_result)

    print("\nSolving with QAOA (real quantum circuit, simulated)...")
    qaoa_result = solve_qaoa(qp)
    print(qaoa_result)

    print("\nMatch:", exact_result.x.tolist() == qaoa_result.x.tolist())