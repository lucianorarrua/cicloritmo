export function calculateDistance(rpm, res) {
  const speedKmh = (rpm * 0.25) * (1 + (res * 0.05));
  const distanceMetersPerSecond = (speedKmh * 1000) / 3600;
  return distanceMetersPerSecond / 1000;
}

export function calculateCalories(rpm, res) {
  const met = 3 + (res * 0.8) + (rpm / 25);
  const userWeightKg = 70;
  return (met * 3.5 * userWeightKg / 200) / 60;
}
