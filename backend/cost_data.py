# rough placeholder values — refine later using your research doc numbers
FUEL_PRICE_PER_TON_USD = {
    "diesel": 650,
    "lng": 550,
    "methanol": 700,
    "ammonia": 750,
    "hydrogen": 900,
}

# well-to-wake emission factor: tons CO2 per ton fuel burned
EMISSION_FACTOR = {
    "diesel": 3.2,
    "lng": 2.75,
    "methanol": 1.6,
    "ammonia": 0.0,      # assume green ammonia for this MVP
    "hydrogen": 0.0,      # assume green hydrogen for this MVP
}

EU_ETS_PRICE_PER_TON_CO2_EUR = 75