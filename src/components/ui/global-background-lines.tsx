"use client";

import React from 'react';

const GlobalBackgroundLines = () => {
  const lineWrapperTops = ['top-[10%]', 'top-[30%]', 'top-[50%]', 'top-[70%]', 'top-[90%]'];

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-anthracite pointer-events-none">
      <style jsx global>{`
        @keyframes lineMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>

      {/* Grid Background */}
      <div
        className="absolute inset-0 w-full h-full bg-[linear-gradient(rgba(212,175,55,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[length:50px_50px] animate-[gridMove_20s_linear_infinite]"
      />

      {/* Animated Background Lines */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {lineWrapperTops.map((topClass, index) => (
          <div key={index} className={`absolute w-full h-[100px] ${topClass}`}>
            <div className="w-full h-0.5 relative overflow-hidden opacity-20">
              <div
                className={`absolute top-0 w-full h-full animate-[lineMove_4s_linear_infinite] ${
                  index % 2 !== 0 ? '[animation-direction:reverse] [animation-delay:2s]' : ''
                }`}
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, #d4af37 20%, #f5f5f5 50%, #d4af37 80%, transparent 100%)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalBackgroundLines;
