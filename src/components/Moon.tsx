import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh } from 'three';
import { MOON_ORBIT_PERIOD_S } from '../types';
import { TEXTURES } from '../constants';

interface MoonProps {
  autoRotate: boolean;
  speed: number;
}

export const Moon: React.FC<MoonProps> = ({ autoRotate, speed }) => {
  const moonRef = useRef<Mesh>(null);
  const angleRef = useRef(0);
  const moonTexture = useLoader(TextureLoader, TEXTURES.MOON);
  
  // Configuration
  // Earth Radius = 1
  // Real Moon Radius = ~0.273 Earth Radii
  const MOON_SCALE = 0.273;
  
  // Real Distance = ~60 Earth Radii
  // This is quite far for a dashboard view. 
  // We'll use a "Cinematic Distance" that is closer but still clearly separate.
  const ORBIT_RADIUS = 15; 

  useFrame((state, delta) => {
    if (!moonRef.current || !autoRotate) return;

    if (speed === 1) {
      // STRICT REAL-TIME MODE
      const now = new Date();
      const utcMs = now.getTime();
      const totalSeconds = utcMs / 1000;
      
      // Calculate orbital position
      // Note: This is a simplified circular orbit model
      const angle = (totalSeconds % MOON_ORBIT_PERIOD_S) / MOON_ORBIT_PERIOD_S * (Math.PI * 2);
      angleRef.current = angle;
    } else {
      // DEMO MODE
      // Match the visual speed multiplier from RealTimeGlobe
      const VISUAL_SPEED_MULTIPLIER = 1000;
      const effectiveSpeed = speed * VISUAL_SPEED_MULTIPLIER;
      const angularVelocity = (Math.PI * 2) / MOON_ORBIT_PERIOD_S;
      
      angleRef.current += angularVelocity * effectiveSpeed * delta;
    }

    const angle = angleRef.current;

    // Update Position (Orbit)
    // Simple circular orbit in the X-Z plane
    moonRef.current.position.x = Math.sin(angle) * ORBIT_RADIUS;
    moonRef.current.position.z = Math.cos(angle) * ORBIT_RADIUS;

    // Update Rotation (Tidal Locking)
    // The Moon always shows the same face to Earth.
    // In a local frame, this means it rotates exactly once per orbit.
    // We adjust the offset (Math.PI) so the correct face points inward.
    moonRef.current.rotation.y = angle - Math.PI / 2; 
  });

  return (
    <mesh 
      ref={moonRef} 
      castShadow 
      receiveShadow
      scale={[MOON_SCALE, MOON_SCALE, MOON_SCALE]}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial 
        map={moonTexture} 
        roughness={0.9} // Moon is dusty/rough
        metalness={0}
        color="#cccccc" // Slight brightness boost
      />
    </mesh>
  );
};
