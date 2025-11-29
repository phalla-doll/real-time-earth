import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { RealTimeGlobe } from './components/RealTimeGlobe';
import { RotationMode, EarthState } from './types';
import { Sun } from './components/Sun';
import { FPSCounter } from './components/FPSCounter';

// Loading fallback component
const Loader = () => (
  <Html center>
    <div className="text-emerald-500 font-mono text-xs tracking-widest uppercase animate-pulse">Initializing Textures...</div>
  </Html>
);

const App: React.FC = () => {
  const [earthState, setEarthState] = useState<EarthState>({
    mode: RotationMode.SOLAR,
    showClouds: true,
    showAxis: false,
    autoRotate: true,
    speed: 1,
  });

  const toggleClouds = () => setEarthState(prev => ({ ...prev, showClouds: !prev.showClouds }));
  const toggleAxis = () => setEarthState(prev => ({ ...prev, showAxis: !prev.showAxis }));
  const toggleAutoRotate = () => setEarthState(prev => ({ ...prev, autoRotate: !prev.autoRotate }));
  
  const setSpeed = (speed: number) => setEarthState(prev => ({ 
    ...prev, 
    speed,
    // If speed is greater than 1, user likely wants to see animation, so force auto-rotate on
    autoRotate: speed > 1 ? true : prev.autoRotate
  }));

  return (
    <div className="relative w-full h-full bg-black font-sans">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={['#050505']} />
        
        <ambientLight intensity={0.1} /> 
        <Sun />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={<Loader />}>
          <RealTimeGlobe 
            mode={earthState.mode} 
            showClouds={earthState.showClouds} 
            showAxis={earthState.showAxis}
            autoRotate={earthState.autoRotate}
            speed={earthState.speed}
          />
        </Suspense>
        
        <OrbitControls enablePan={false} minDistance={2.5} maxDistance={10} />
      </Canvas>

      <FPSCounter />

      {/* UI Overlay - Futuristic Design */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <div className="bg-black/80 backdrop-blur-md text-emerald-400 p-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] rounded-none">
          {/* Header */}
          <div className="border-b border-emerald-500/30 pb-4 mb-5">
            <h1 className="text-xl font-mono font-bold uppercase tracking-widest flex items-center gap-3 text-emerald-400">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981] rounded-none"></span>
              Real-Time Earth
            </h1>
            <p className="text-[10px] text-emerald-600/80 font-mono mt-2 uppercase tracking-wider">
              System: UTC // Axial Tilt: 23.4°
            </p>
          </div>

          <div className="space-y-6 font-mono">
            {/* Rotation Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                Rotation Reference
              </label>
              <div className="flex border border-emerald-900/50 bg-black/50 p-1 gap-1 rounded-none">
                <button
                  onClick={() => setEarthState(prev => ({ ...prev, mode: RotationMode.SOLAR }))}
                  className={`flex-1 py-2 text-xs font-bold transition-all border rounded-none ${
                    earthState.mode === RotationMode.SOLAR 
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' 
                      : 'text-emerald-800 border-transparent hover:text-emerald-500 hover:bg-emerald-900/10'
                  }`}
                >
                  SOLAR
                  <span className="block text-[9px] opacity-60">86,400s</span>
                </button>
                <button
                  onClick={() => setEarthState(prev => ({ ...prev, mode: RotationMode.SIDEREAL }))}
                  className={`flex-1 py-2 text-xs font-bold transition-all border rounded-none ${
                    earthState.mode === RotationMode.SIDEREAL 
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' 
                      : 'text-emerald-800 border-transparent hover:text-emerald-500 hover:bg-emerald-900/10'
                  }`}
                >
                  SIDEREAL
                  <span className="block text-[9px] opacity-60">86,164s</span>
                </button>
              </div>
            </div>

            {/* Rotation Speed Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                Rotation Speed
              </label>
              <div className="flex border border-emerald-900/50 bg-black/50 p-1 gap-1 rounded-none">
                {[1, 3, 5, 10].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`flex-1 py-2 text-xs font-bold transition-all border rounded-none ${
                      earthState.speed === s
                        ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/50 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]'
                        : 'text-emerald-800 border-transparent hover:text-emerald-500 hover:bg-emerald-900/10'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2">
              {/* Auto Rotate Toggle */}
              <div className="flex items-center justify-between group">
                <span className="text-xs text-emerald-100/70 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Auto Rotate</span>
                <button
                  onClick={toggleAutoRotate}
                  className={`w-10 h-5 border transition-all relative rounded-none ${
                    earthState.autoRotate 
                    ? 'bg-emerald-500/20 border-emerald-500' 
                    : 'bg-black border-emerald-900'
                  }`}
                >
                  <div className={`absolute top-0.5 bottom-0.5 w-4 bg-emerald-400 transition-all duration-300 rounded-none ${
                    earthState.autoRotate ? 'left-5 shadow-[0_0_8px_#34d399]' : 'left-0.5 opacity-30 bg-emerald-800'
                  }`} />
                </button>
              </div>

              {/* Atmosphere Toggle */}
              <div className="flex items-center justify-between group">
                <span className="text-xs text-emerald-100/70 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Atmosphere</span>
                <button
                  onClick={toggleClouds}
                  className={`w-10 h-5 border transition-all relative rounded-none ${
                    earthState.showClouds 
                    ? 'bg-emerald-500/20 border-emerald-500' 
                    : 'bg-black border-emerald-900'
                  }`}
                >
                  <div className={`absolute top-0.5 bottom-0.5 w-4 bg-emerald-400 transition-all duration-300 rounded-none ${
                    earthState.showClouds ? 'left-5 shadow-[0_0_8px_#34d399]' : 'left-0.5 opacity-30 bg-emerald-800'
                  }`} />
                </button>
              </div>
              
              {/* Axis Toggle */}
              <div className="flex items-center justify-between group">
                <span className="text-xs text-emerald-100/70 group-hover:text-emerald-400 transition-colors uppercase tracking-wider">Show Axis</span>
                <button
                  onClick={toggleAxis}
                  className={`w-10 h-5 border transition-all relative rounded-none ${
                    earthState.showAxis 
                    ? 'bg-emerald-500/20 border-emerald-500' 
                    : 'bg-black border-emerald-900'
                  }`}
                >
                  <div className={`absolute top-0.5 bottom-0.5 w-4 bg-emerald-400 transition-all duration-300 rounded-none ${
                    earthState.showAxis ? 'left-5 shadow-[0_0_8px_#34d399]' : 'left-0.5 opacity-30 bg-emerald-800'
                  }`} />
                </button>
              </div>
            </div>
            
            {/* Info Box */}
            <div className="mt-6 p-3 bg-emerald-900/10 border-l-2 border-emerald-500/50 text-[10px] text-emerald-400/60 leading-relaxed font-mono rounded-none">
               <span className="text-emerald-500 font-bold">INFO_LOG:</span>
               {earthState.speed === 1 ? " SYSTEM SYNCHRONIZED WITH UTC." : " DEMO VISUALIZATION MODE ACTIVE."}
               <br/>
               CURRENT MODE: {earthState.mode === RotationMode.SIDEREAL ? "FIXED STARS RELATIVE" : "SUN RELATIVE"}.
               <br/>
               SPEED MULTIPLIER: {earthState.speed}x {earthState.speed > 1 ? "(SCALED FOR VISIBILITY)" : ""}.
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none select-none">
         <div className="text-[10px] text-emerald-800 uppercase tracking-[0.2em] mb-1 font-mono">Status</div>
         <div className={`text-xs font-mono tracking-widest ${earthState.autoRotate ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'text-orange-500'}`}>
           {earthState.autoRotate ? (earthState.speed === 1 ? 'LIVE UTC SYNC ACTIVE' : `SIMULATION SPEED ${earthState.speed}x`) : 'ROTATION PAUSED'}
         </div>
      </div>
    </div>
  );
};

export default App;
