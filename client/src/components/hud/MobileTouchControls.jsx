import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Flame, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export function MobileTouchControls({ onTouchKey, onResetCar }) {
  const handleTouchStart = (key, e) => {
    e.preventDefault();
    soundManager.init();
    onTouchKey(key, true);
  };

  const handleTouchEnd = (key, e) => {
    e.preventDefault();
    onTouchKey(key, false);
  };

  return (
    <div className="absolute inset-x-0 bottom-4 z-40 flex justify-between items-end px-4 pointer-events-none select-none">
      
      {/* ================= LEFT SIDE: STEERING CONTROLS ================= */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Steer Left */}
        <button
          onTouchStart={(e) => handleTouchStart('left', e)}
          onTouchEnd={(e) => handleTouchEnd('left', e)}
          onMouseDown={(e) => handleTouchStart('left', e)}
          onMouseUp={(e) => handleTouchEnd('left', e)}
          onMouseLeave={(e) => handleTouchEnd('left', e)}
          className="w-16 h-16 rounded-2xl glass-panel active:bg-cyan-500/40 border border-cyan-400/50 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-8 h-8" />
          <span className="text-[9px] font-mono font-bold mt-0.5">LEFT</span>
        </button>

        {/* Steer Right */}
        <button
          onTouchStart={(e) => handleTouchStart('right', e)}
          onTouchEnd={(e) => handleTouchEnd('right', e)}
          onMouseDown={(e) => handleTouchStart('right', e)}
          onMouseUp={(e) => handleTouchEnd('right', e)}
          onMouseLeave={(e) => handleTouchEnd('right', e)}
          className="w-16 h-16 rounded-2xl glass-panel active:bg-cyan-500/40 border border-cyan-400/50 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-95 transition-transform"
        >
          <ArrowRight className="w-8 h-8" />
          <span className="text-[9px] font-mono font-bold mt-0.5">RIGHT</span>
        </button>
      </div>

      {/* ================= MIDDLE: RESET CAR BUTTON ================= */}
      <div className="pointer-events-auto mb-1">
        <button
          onClick={onResetCar}
          className="p-2.5 rounded-xl glass-panel text-slate-400 active:text-cyan-300 active:scale-95 transition-all flex items-center gap-1 text-[10px] font-mono border border-slate-700"
          title="Reset Car on Track"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>

      {/* ================= RIGHT SIDE: GAS, BRAKE, DRIFT, NITRO ================= */}
      <div className="flex items-end gap-2.5 pointer-events-auto">
        
        {/* Secondary Column: Nitro & Drift */}
        <div className="flex flex-col gap-2">
          {/* Nitro Boost */}
          <button
            onTouchStart={(e) => handleTouchStart('boost', e)}
            onTouchEnd={(e) => handleTouchEnd('boost', e)}
            onMouseDown={(e) => handleTouchStart('boost', e)}
            onMouseUp={(e) => handleTouchEnd('boost', e)}
            onMouseLeave={(e) => handleTouchEnd('boost', e)}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 active:from-cyan-400 active:to-blue-400 text-white flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition-transform border border-cyan-300/40"
          >
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-[8px] font-mono font-extrabold">NITRO</span>
          </button>

          {/* Handbrake Drift */}
          <button
            onTouchStart={(e) => handleTouchStart('brake', e)}
            onTouchEnd={(e) => handleTouchEnd('brake', e)}
            onMouseDown={(e) => handleTouchStart('brake', e)}
            onMouseUp={(e) => handleTouchEnd('brake', e)}
            onMouseLeave={(e) => handleTouchEnd('brake', e)}
            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-700 to-pink-600 active:from-purple-500 active:to-pink-400 text-white flex flex-col items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.4)] active:scale-95 transition-transform border border-purple-300/40"
          >
            <Flame className="w-5 h-5 text-amber-300" />
            <span className="text-[8px] font-mono font-extrabold">DRIFT</span>
          </button>
        </div>

        {/* Primary Pedals Column: Gas & Reverse */}
        <div className="flex flex-col gap-2">
          {/* Gas / Accelerate */}
          <button
            onTouchStart={(e) => handleTouchStart('forward', e)}
            onTouchEnd={(e) => handleTouchEnd('forward', e)}
            onMouseDown={(e) => handleTouchStart('forward', e)}
            onMouseUp={(e) => handleTouchEnd('forward', e)}
            onMouseLeave={(e) => handleTouchEnd('forward', e)}
            className="w-16 h-20 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-700 active:from-emerald-400 active:to-teal-600 text-slate-950 font-black flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-transform border border-emerald-300/60"
          >
            <ArrowUp className="w-8 h-8 text-slate-950" />
            <span className="text-[10px] font-mono font-black tracking-wider text-slate-950 mt-0.5">GAS</span>
          </button>

          {/* Brake / Reverse */}
          <button
            onTouchStart={(e) => handleTouchStart('backward', e)}
            onTouchEnd={(e) => handleTouchEnd('backward', e)}
            onMouseDown={(e) => handleTouchStart('backward', e)}
            onMouseUp={(e) => handleTouchEnd('backward', e)}
            onMouseLeave={(e) => handleTouchEnd('backward', e)}
            className="w-16 h-14 rounded-xl bg-gradient-to-b from-rose-600 to-red-800 active:from-rose-500 active:to-red-700 text-white flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] active:scale-95 transition-transform border border-rose-400/50"
          >
            <ArrowDown className="w-6 h-6 text-white" />
            <span className="text-[9px] font-mono font-extrabold">BRAKE</span>
          </button>
        </div>

      </div>

    </div>
  );
}
