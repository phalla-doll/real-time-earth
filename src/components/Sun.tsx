import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
  showSun: boolean;
}

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  // Slow down time
  float t = time * 0.1;
  
  // Multi-fractal noise
  float noise = snoise(vPosition * 2.0 + t);
  noise += 0.5 * snoise(vPosition * 4.0 - t * 1.5);
  noise += 0.25 * snoise(vPosition * 8.0 + t * 2.0);
  
  // Normalize noise to 0-1 range approximately
  noise = (noise + 1.0) * 0.5;
  
  // Colors
  vec3 colorDark = vec3(0.8, 0.2, 0.0); // Dark Orange/Red
  vec3 colorLight = vec3(1.0, 0.8, 0.3); // Bright Yellow
  vec3 colorHot = vec3(1.0, 1.0, 0.8); // Almost White
  
  vec3 finalColor = mix(colorDark, colorLight, noise);
  // Add hot spots
  finalColor = mix(finalColor, colorHot, pow(noise, 3.0));
  
  // Edge darkening (simple fresnel approximation inverted)
  // We want the center to be brighter? Or consistent? 
  // Sun usually looks limb-darkened (darker at edges)
  // float viewAngle = dot(vNormal, vec3(0.0, 0.0, 1.0)); // Simplified view vector
  // finalColor *= (0.6 + 0.4 * viewAngle);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const glowVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const glowFragmentShader = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
  gl_FragColor = vec4(1.0, 0.6, 0.1, 1.0) * intensity;
}
`;

export const Sun: React.FC<SunProps> = ({ showSun }) => {
  // Position the visual sun further away but along the same light vector [10, 0, 5]
  // Vector is approx [0.89, 0, 0.44]
  // Let's put it at distance 40
  const sunPosition: [number, number, number] = [35, 0, 17.5];
  
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

  return (
    <group>
      {/* 
        The Sun light. 
        Position [10, 0, 5] gives a nice angle.
        Added shadow bias to prevent "shadow acne" on the Earth surface when clouds cast shadows.
      */}
      <directionalLight 
        position={[10, 0, 5]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      {/* Backlight for rim effect */}
      <spotLight position={[-10, 0, -5]} intensity={0.5} color="#444" />

      {/* Visual Sun Mesh */}
      {showSun && (
        <group position={sunPosition}>
          {/* Dynamic Sun Surface */}
          <mesh>
            <sphereGeometry args={[3, 64, 64]} />
            <shaderMaterial
              ref={materialRef}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
            />
          </mesh>

          {/* Glow / Corona */}
          {/* 
             Simple sprite-based glow or inverted hull. 
             Using a sprite is often cleaner for simple glow.
          */}
           <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial 
              color="#ff8800" 
              transparent 
              opacity={0.15} 
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
           <mesh scale={[1.5, 1.5, 1.5]}>
            <sphereGeometry args={[3, 32, 32]} />
            <meshBasicMaterial 
              color="#ff4400" 
              transparent 
              opacity={0.1} 
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
