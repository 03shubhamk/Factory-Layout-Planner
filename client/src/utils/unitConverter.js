/**
 * Engineering Unit Conversion Utility Functions
 */

export const UnitConverter = {
  // Distance
  metersToFeet: (m) => Number((m * 3.28084).toFixed(4)),
  feetToMeters: (ft) => Number((ft / 3.28084).toFixed(4)),
  metersToInches: (m) => Number((m * 39.3701).toFixed(3)),
  inchesToMeters: (inch) => Number((inch / 39.3701).toFixed(4)),

  // Area
  sqMetersToSqFeet: (sqm) => Number((sqm * 10.7639).toFixed(3)),
  sqFeetToSqMeters: (sqft) => Number((sqft / 10.7639).toFixed(3)),

  // Power
  kwToHp: (kw) => Number((kw * 1.34102).toFixed(3)),
  hpToKw: (hp) => Number((hp / 1.34102).toFixed(3)),

  // Pressure
  barToPsi: (bar) => Number((bar * 14.5038).toFixed(2)),
  psiToBar: (psi) => Number((psi / 14.5038).toFixed(3)),

  // Temperature
  celsiusToFahrenheit: (c) => Number(((c * 9/5) + 32).toFixed(2)),
  fahrenheitToCelsius: (f) => Number(((f - 32) * 5/9).toFixed(2)),

  // Velocity
  mpsToFpm: (mps) => Number((mps * 196.85).toFixed(2)), // Meters/sec to Feet/min
  fpmToMps: (fpm) => Number((fpm / 196.85).toFixed(3))
};

export default UnitConverter;
