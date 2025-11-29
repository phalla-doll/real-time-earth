import React, { useEffect, useRef } from 'react';

export const FPSCounter: React.FC = () => {
  const valueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const loop = () => {
      const time = performance.now();
      frameCount++;

      if (time >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (time - lastTime));
        if (valueRef.current) {
          valueRef.current.innerText = `${fps} FPS`;
        }
        frameCount = 0;
        lastTime = time;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute top-6 right-6 text-right pointer-events-none select-none z-50">
      <div className="text-[10px] text-emerald-800 uppercase tracking-[0.2em] mb-1 font-mono">
        Performance
      </div>
      <div 
        ref={valueRef}
        className="text-xs font-mono tracking-widest text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]"
      >
        -- FPS
      </div>
    </div>
  );
};
