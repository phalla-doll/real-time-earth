import React from 'react';

export const Sun: React.FC = () => {
  return (
    <group>
      {/* 
        The Sun light. 
        Position [10, 2, 5] gives a nice angle.
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
    </group>
  );
};