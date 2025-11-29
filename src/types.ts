export enum RotationMode {
  SOLAR = 'SOLAR',
  SIDEREAL = 'SIDEREAL'
}

export interface EarthState {
  mode: RotationMode;
  showClouds: boolean;
  showAxis: boolean;
  showMoon: boolean;
  showSun: boolean;
  autoRotate: boolean;
  speed: number;
}

// Physical constants
// Solar day: 24 hours = 86400 seconds
export const SOLAR_DAY_S = 86400;
// Sidereal day: ~23h 56m 4.0905s = 86164.0905 seconds
export const SIDEREAL_DAY_S = 86164.0905;
// Moon Sidereal Orbital Period: ~27.3217 days
export const MOON_ORBIT_PERIOD_S = 2360591;
// Axial tilt of Earth in radians (approx 23.44 degrees)
export const EARTH_AXIAL_TILT_RAD = 23.439 * (Math.PI / 180);
// Moon Axial Tilt (relative to ecliptic is 1.54, but relative to Earth's equator varies)
// For simple viz, we can treat it as small or aligned for now, or just 0 relative to its orbit.
export const MOON_AXIAL_TILT_RAD = 6.68 * (Math.PI / 180); // Relative to orbit plane approx
