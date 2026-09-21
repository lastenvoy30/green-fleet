def calculate_fuel_consumption(speed_knots, displacement_tons, weather_factor=1.0, admiralty_coefficient=450):
    """
    Estimates fuel consumption (tons/day) using a simplified Admiralty Formula.

    speed_knots: vessel speed in knots
    displacement_tons: vessel displacement in tons
    weather_factor: multiplier for sea/weather conditions
                     (1.0 = calm, higher = rougher, e.g. 1.15 for rough seas)
    admiralty_coefficient: a constant capturing hull efficiency,
                            typically 400-600 depending on vessel type
    """
    # Effective Horsepower estimate from Admiralty Formula
    ehp = (displacement_tons ** (2/3)) * (speed_knots ** 3) / admiralty_coefficient

    # Apply weather resistance factor
    adjusted_ehp = ehp * weather_factor

    # Convert power to fuel burned per day
    # (rough conversion factor: fuel tons/day per unit EHP)
    fuel_conversion_factor = 0.19  # tunable constant, based on typical SFOC
    fuel_tons_per_day = adjusted_ehp * fuel_conversion_factor / 100

    return round(fuel_tons_per_day, 2)


if __name__ == "__main__":
    # sanity checks
    print("Calm, moderate speed:", calculate_fuel_consumption(14, 50000, weather_factor=1.0))
    print("Calm, high speed:", calculate_fuel_consumption(20, 50000, weather_factor=1.0))
    print("Rough weather, same speed:", calculate_fuel_consumption(14, 50000, weather_factor=1.2))
    print("Smaller ship, same speed:", calculate_fuel_consumption(14, 20000, weather_factor=1.0))