import React from 'react';
import { 
  Volume2, VolumeX, Camera, ShieldCheck, ShieldAlert, 
  Wallet, Trophy, Zap, Gauge, Sparkles, Navigation, Info, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Minimap } from './Minimap';

export function HUD({
  carData,
  cameraMode,
  setCameraMode,
  isMuted,
  onToggleMute,
  walletAddress,
  onConnectWallet,
  hasAccess,
  setHasAccess,
  visitedLandmarks = [],
  collectedSkills = [],
  onOpenModal,
  onFastTravel
}) {
  const speed = carData?.speedKmH || 0;
  const nitro = carData?.nitro ?? 100;
  const driftScore = carData?.driftScore || 0;
  const isDrifting = carData?.isDrifting;

  // Compute Current Gear
  let gear = 'N';
  if (speed === 0) gear = 'N';
  else if (speed < 20) gear = '1';
  else if (speed < 45) gear = '2';
  else if (speed < 75) gear = '3';
  else if (speed < 110) gear = '4';
  else if (speed < 150) gear = '5';
  else gear = '6';

  const STATIONS = [
    { id: 'about_monument', label: '1. About Me', modal: 'about' },
    { id: 'project_highway', label: '2. Projects', modal: 'projects' },
    { id: 'skills_arena', label: '3. Skills Slalom', modal: 'skills' },
    { id: 'web3_oasis', label: '4. Web3 Oasis', modal: 'garage' },
    { id: 'contact_base', label: '5. Contact Pit', modal: 'contact' },
  ];

  const visitedCount = STATIONS.filter(s => visitedLandmarks.includes(s.id)).length;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 md:p-6 select-none">
      
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Project Branding & Logo */}
        <div className="flex items-center gap-3 glass-panel px-4 py-2.5 rounded-2xl border border-cyan-500/40 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_15px_#00f0ff]">
            🏎️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                PORTFOLIO V8.0
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
              </span>
            </div>
            <h1 className="text-sm md:text-base font-extrabold text-white tracking-wide">
              Azad Singh <span className="text-cyan-400 font-mono text-xs">| 3D Web3 Circuit</span>
            </h1>
          </div>
        </div>

        {/* 5-Station Exploration Progress Tracker */}
        <div className="hidden lg:flex items-center gap-1.5 glass-panel px-4 py-2 rounded-2xl border border-slate-700/80">
          <span className="text-[11px] font-mono font-bold text-slate-400 mr-2 uppercase flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Exploration ({visitedCount}/5):
          </span>
          {STATIONS.map((station) => {
            const isDone = visitedLandmarks.includes(station.id);
            return (
              <button
                key={station.id}
                onClick={() => onOpenModal(station.modal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-800/60 text-slate-500 hover:text-slate-300 border border-slate-700'
                }`}
              >
                {isDone ? `✓ ${station.label}` : station.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Wallet Connection */}
        <div className="flex items-center gap-2">
          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md"
            title={isMuted ? 'Unmute Audio FX & Engine' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Camera Mode Toggle */}
          <button
            onClick={() => {
              const modes = ['chase', 'hood', 'top'];
              const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
              setCameraMode(modes[nextIdx]);
            }}
            className="px-3 py-2 rounded-xl glass-panel text-xs font-mono font-bold text-slate-300 hover:text-purple-400 border border-slate-700 hover:border-purple-500/50 transition-all shadow-md flex items-center gap-1.5"
            title="Switch Camera View Angle"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span className="uppercase hidden sm:inline">{cameraMode} CAM</span>
          </button>

          {/* Team BYTEX Hackathon Pass Badge */}
          <button
            onClick={() => setHasAccess(!hasAccess)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all border shadow-md flex items-center gap-1.5 ${
              hasAccess
                ? 'glass-panel-emerald text-emerald-300 border-emerald-500/40'
                : 'glass-panel text-slate-400 border-slate-700'
            }`}
            title="Toggle Team BYTEX Hackathon NFT Pass"
          >
            {hasAccess ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden md:inline">BYTEX PASS ACTIVE</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="hidden md:inline">PASS LOCKED</span>
              </>
            )}
          </button>

          {/* Web3 Wallet Connect Button */}
          <button
            onClick={onConnectWallet}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1.5 transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>
              {walletAddress 
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
                : 'Connect Wallet'}
            </span>
          </button>
        </div>

      </div>

      {/* ================= MIDDLE DRIFT / SPEED POPUP ================= */}
      {isDrifting && (
        <div className="self-center glass-panel-purple px-6 py-2 rounded-2xl border border-purple-500/60 shadow-[0_0_30px_rgba(157,78,221,0.6)] animate-bounce text-center pointer-events-none">
          <span className="text-xs font-mono font-bold text-amber-300 block uppercase tracking-widest">
            🔥 DRIFT SLIDE
          </span>
          <span className="text-2xl font-black font-mono text-white text-glow-purple">
            +{driftScore} PTS
          </span>
        </div>
      )}

      {/* ================= BOTTOM INSTRUMENT PANEL ================= */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4">
        
        {/* Speedometer & Car Telemetry Panel */}
        <div className="glass-panel p-4 md:p-5 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col gap-3 min-w-[240px] pointer-events-auto">
          {/* Top Info Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>VEHICLE TELEMETRY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400">GEAR</span>
              <span className="w-6 h-6 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-xs flex items-center justify-center">
                {gear}
              </span>
            </div>
          </div>

          {/* Speed Digital Readout */}
          <div className="flex items-baseline justify-between">
            <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white text-glow-cyan">
              {speed}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">KM / H</span>
          </div>

          {/* Nitro Boost Meter */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-cyan-300">
                <Zap className="w-3 h-3 text-cyan-400" /> NITRO BOOST [SHIFT]
              </span>
              <span>{Math.round(nitro)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-75 shadow-[0_0_10px_#00f0ff]"
                style={{ width: `${nitro}%` }}
              ></div>
            </div>
          </div>

          {/* Controls Quick Reference Guide */}
          <div className="text-[10px] font-mono text-slate-400 grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/80">
            <div><kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">W/S</kbd> Gas / Brake</div>
            <div><kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">A/D</kbd> Steer</div>
            <div><kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">SPACE</kbd> Drift</div>
            <div><kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">R</kbd> Reset Car</div>
          </div>
        </div>

        {/* Bottom-Right Radar Minimap */}
        <div className="pointer-events-auto">
          <Minimap
            carPos={carData?.pos}
            carRot={carData?.rotationY || 0}
            onFastTravel={onFastTravel}
          />
        </div>

      </div>

    </div>
  );
}
