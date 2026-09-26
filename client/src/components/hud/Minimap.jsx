import React from 'react';
import { Compass, Navigation } from 'lucide-react';

const LANDMARKS = [
  { id: 'about', name: 'About Me', x: 0, z: -50, color: '#00f0ff', num: '1' },
  { id: 'projects', name: 'Projects', x: 100, z: 50, color: '#9d4edd', num: '2' },
  { id: 'skills', name: 'Skills', x: -80, z: 80, color: '#10b981', num: '3' },
  { id: 'garage', name: 'Web3 Garage', x: -120, z: -60, color: '#ffd166', num: '4' },
  { id: 'contact', name: 'Contact Base', x: 50, z: -120, color: '#f72585', num: '5' },
];

export function Minimap({ carPos, carRot = 0, onFastTravel }) {
  // Map world coords [-150, 150] to minimap canvas [0, 180]
  const mapScale = 0.55;
  const mapCenter = 90;

  const toMapCoords = (wx, wz) => {
    return {
      x: mapCenter + wx * mapScale,
      y: mapCenter + wz * mapScale,
    };
  };

  const carCoords = carPos ? toMapCoords(carPos.x, carPos.z) : { x: mapCenter, y: mapCenter };

  return (
    <div className="relative w-48 h-48 rounded-2xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md overflow-hidden shadow-2xl p-2 flex flex-col">
      {/* Minimap Header */}
      <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 border-b border-slate-800 pb-1 px-1">
        <div className="flex items-center gap-1">
          <Navigation className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>GPS RADAR</span>
        </div>
        <span className="text-[9px] text-slate-400">CLICK TO WARP</span>
      </div>

      {/* Radar Canvas Area */}
      <div className="relative flex-1 w-full h-full mt-1">
        {/* Concentric Radar Grid Rings */}
        <div className="absolute inset-0 border border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-4 border border-cyan-500/15 rounded-full"></div>
        <div className="absolute inset-8 border border-cyan-500/10 rounded-full"></div>

        {/* Crosshair Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-500/20"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-500/20"></div>

        {/* Circuit Track Outline on Radar */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          <ellipse cx="90" cy="90" rx="68" ry="60" fill="none" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 3" />
        </svg>

        {/* Landmark Station Marker Beacons */}
        {LANDMARKS.map(lm => {
          const pt = toMapCoords(lm.x, lm.z);
          return (
            <button
              key={lm.id}
              onClick={() => onFastTravel(lm.x, lm.z, lm.id)}
              title={`Fast-travel to ${lm.name}`}
              style={{ left: `${pt.x - 7}px`, top: `${pt.y - 7}px` }}
              className="absolute w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold font-mono text-slate-950 transition-transform hover:scale-150 z-10 shadow-lg cursor-pointer"
            >
              <span 
                className="w-full h-full rounded-full flex items-center justify-center animate-pulse"
                style={{ backgroundColor: lm.color }}
              >
                {lm.num}
              </span>
            </button>
          );
        })}

        {/* Player Car Arrow Blip */}
        <div
          style={{
            left: `${carCoords.x - 6}px`,
            top: `${carCoords.y - 6}px`,
            transform: `rotate(${carRot}rad)`
          }}
          className="absolute w-3 h-3 z-20 pointer-events-none transition-all duration-75"
        >
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[9px] border-b-cyan-300 drop-shadow-[0_0_6px_#00f0ff]"></div>
        </div>
      </div>
    </div>
  );
}
