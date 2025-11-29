import React from 'react';

export const Credit: React.FC = () => {
  return (
    <div className="absolute bottom-6 left-6 text-left pointer-events-none select-none z-50">
      <div className="text-[10px] text-emerald-800 uppercase tracking-[0.2em] mb-1 font-mono">
        Made with R3F by
      </div>
      <a 
        href="https://mantha.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono tracking-widest text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] pointer-events-auto hover:text-emerald-300 transition-colors cursor-pointer block"
      >
        Mantha
      </a>
    </div>
  );
};
