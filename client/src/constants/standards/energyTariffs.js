/**
 * Industrial Time-of-Use (TOU) Energy Pricing & Carbon Emission Factor Constants
 */

export const ENERGY_TARIFF_MODELS = {
  PEAK_HOURS: {
    name: 'On-Peak (14:00 - 20:00)',
    costPerKwhUsd: 0.28,
    co2KgPerKwh: 0.52
  },
  MID_PEAK_HOURS: {
    name: 'Mid-Peak (08:00 - 14:00, 20:00 - 22:00)',
    costPerKwhUsd: 0.16,
    co2KgPerKwh: 0.44
  },
  OFF_PEAK_HOURS: {
    name: 'Off-Peak (22:00 - 08:00)',
    costPerKwhUsd: 0.08,
    co2KgPerKwh: 0.35
  },
  DEMAND_CHARGE_PER_KW_MONTH: 14.50,
  BASE_POWER_FACTOR_PENALTY_THRESHOLD: 0.90 // Below 0.90 PF incurs grid surcharge
};

export default ENERGY_TARIFF_MODELS;
