export enum RotationMode {
  SOLAR = 'SOLAR',
  SIDEREAL = 'SIDEREAL'
}

export interface EarthState {
  mode: RotationMode;
  showClouds: boolean;
  showAxis: boolean;
  autoRotate: boolean;
  speed: number;
}

// Physical constants
// Solar day: 24 hours = 86400 seconds
export const SOLAR_DAY_S = 86400;
// Sidereal day: ~23h 56m 4.0905s = 86164.0905 seconds
export const SIDEREAL_DAY_S = 86164.0905;
// Axial tilt of Earth in radians (approx 23.44 degrees)
export const EARTH_AXIAL_TILT_RAD = 23.439 * (Math.PI / 180);