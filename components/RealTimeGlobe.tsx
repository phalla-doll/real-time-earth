import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Group, FrontSide, Mesh, Color, RepeatWrapping } from 'three';
import { RotationMode, SOLAR_DAY_S, SIDEREAL_DAY_S, EARTH_AXIAL_TILT_RAD } from '../types';
import { TEXTURES } from '../constants';

interface RealTimeGlobeProps {
  mode: RotationMode;
  showClouds: boolean;
  showAxis: boolean;
  autoRotate: boolean;
  speed: number;
}

export const RealTimeGlobe: React.FC<RealTimeGlobeProps> = ({ 
  mode, 
  showClouds, 
  showAxis,
  autoRotate,
  speed 
}) => {
  const earthRef = useRef<Group>(null);
  const cloudsRef = useRef<Mesh>(null);
  
  // Load textures using Suspense-ready loader
  const [colorMap, normalMap, specularMap, cloudsMap, nightMap] = useLoader(TextureLoader, [
    TEXTURES.DIFFUSE,
    TEXTURES.NORMAL,
    TEXTURES.SPECULAR,
    TEXTURES.CLOUDS,
    TEXTURES.NIGHT,
  ]);

  // Configure cloud texture for scrolling
  useEffect(() => {
    cloudsMap.wrapS = RepeatWrapping;
    cloudsMap.wrapT = RepeatWrapping;
  }, [cloudsMap]);

  // Math for rotation
  useFrame((state, delta) => {
    if (!earthRef.current || !autoRotate) return;

    // Determine rotation period based on mode
    // Solar Day: 86400 seconds
    // Sidereal Day: 86164.0905 seconds
    const dayLengthSeconds = mode === RotationMode.SOLAR ? SOLAR_DAY_S : SIDEREAL_DAY_S;

    if (speed === 1) {
      // STRICT REAL-TIME MODE (UTC SYNC)
      // 1. Get current UTC time in milliseconds
      const now = new Date();
      const utcMs = now.getTime(); // Absolute ms since epoch
      
      // 2. Calculate rotation angle based on absolute epoch time
      const totalSeconds = utcMs / 1000;
      
      // Earth rotates West to East (Counter-Clockwise looking from North Pole)
      const rotationAngle = (totalSeconds % dayLengthSeconds) / dayLengthSeconds * (Math.PI * 2);
      
      // Apply rotation to Earth Group
      earthRef.current.rotation.y = rotationAngle;
      
    } else {
      // FAST FORWARD / SIMULATION MODE
      // In this mode, we add relative rotation each frame
      const angularVelocity = (Math.PI * 2) / dayLengthSeconds;
      const step = angularVelocity * speed * delta;
      
      earthRef.current.rotation.y += step;
    }

    // Cloud Wind Animation (UV Scroll)
    // Simulates atmospheric circulation relative to surface
    // Base wind speed factor (approx 0.00005 looks realistic for "moving clouds")
    if (showClouds) {
      // Move clouds slightly West to East (or East to West depending on sign)
      // Negative offset moves texture to the right (Simulating East-to-West trade winds)
      cloudsMap.offset.x -= delta * speed * 0.00004;
    }
  });

  return (
    <group rotation={[0, 0, EARTH_AXIAL_TILT_RAD]}> 
      {/* Axis Line (Visual Aid) */}
      {showAxis && (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 3, 8]} />
          <meshBasicMaterial color="#ef4444" opacity={0.6} transparent />
        </mesh>
      )}

      {/* Earth Group */}
      <group ref={earthRef}>
        
        {/* Main Earth Sphere */}
        <mesh receiveShadow castShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap} 
            normalScale={[0.6, 0.6]} 
            roughnessMap={specularMap} 
            roughness={0.7}
            metalness={0.1}
            emissiveMap={nightMap}
            emissive={new Color(0x444444)}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Cloud Layer */}
        {showClouds && (
          <mesh 
            ref={cloudsRef} 
            scale={[1.01, 1.01, 1.01]} 
            castShadow={true} 
            receiveShadow={false}
          >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
              map={cloudsMap}
              transparent={true}
              opacity={0.8}
              depthWrite={false}
              side={FrontSide}
              blending={2} // Normal blending
              alphaTest={0.1} // Helps with shadow casting accuracy from texture
              color="#ffffff"
            />
          </mesh>
        )}
      </group>
    </group>
  );
};