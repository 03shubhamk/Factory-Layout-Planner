/**
 * OSHA 1910 / ISO 13857 Safety Distances & Industrial Aisle Width Rules
 */

export const SAFETY_STANDARDS = {
  AISLE_WIDTHS: {
    ONE_WAY_PEDESTRIAN: 1.0, // meters (OSHA min 36 inches / ~0.91m)
    TWO_WAY_PEDESTRIAN: 1.5, // meters
    FORKLIFT_SINGLE_LANE: 3.0, // meters (Vehicle width + 1m clearance)
    FORKLIFT_TWO_WAY_LANE: 4.5, // meters
    AGV_DEDICATED_TRACK: 2.0 // meters
  },
  HAZARD_CLEARANCES: {
    HIGH_VOLTAGE_ELECTRICAL: 1.5, // meters (NFPA 70E Arc Flash Boundary)
    WELDING_FLASH_ZONE: 3.0, // meters (Optical radiation boundary)
    LASER_CUTTER_PERIMETER: 2.0, // meters
    CRUSH_PINCH_POINT_BUFFER: 0.8 // meters (ISO 13857 reach-over)
  },
  FIRE_SAFETY: {
    EXIT_CORRIDOR_MIN_WIDTH: 1.2, // meters
    EXTINGUISHER_ACCESS_RADIUS: 1.0, // meters unobstructed
    FIRE_DOOR_SWING_CLEARANCE: 1.5 // meters
  }
};

export default SAFETY_STANDARDS;
