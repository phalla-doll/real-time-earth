// High-quality textures for the Earth
// Note: In a production Next.js app, these would be local files in /public/textures/
export const TEXTURES = {
  // Diffuse map (Color) - High availability CDN from Three.js examples
  DIFFUSE: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
  // Normal map (Topology/Detail) - Better than bump map
  NORMAL: 'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg',
  // Specular map (Water reflection control)
  SPECULAR: 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg',
  // Clouds (Alpha map)
  CLOUDS: 'https://threejs.org/examples/textures/planets/earth_clouds_1024.png',
  // Night lights (Emission) - Sourced from reliable raw GitHub
  NIGHT: 'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-night.jpg',
  // Moon Texture
  MOON: 'https://threejs.org/examples/textures/planets/moon_1024.jpg',
};

export const CAMERA_POSITION: [number, number, number] = [0, 0, 4.5];