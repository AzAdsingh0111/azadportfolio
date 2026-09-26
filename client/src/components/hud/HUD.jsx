import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Camera, ShieldCheck, ShieldAlert, 
  Wallet, Trophy, Zap, Gauge, Sparkles, Navigation, Info, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Compass, Smartphone
} from 'lucide-react';
import { Minimap } from './Minimap';
import { MobileTouchControls } from './MobileTouchControls';
import { setVirtualKey } from '../canvas/Car';

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
  onFastTravel,
  onResetCar
}) {
  const [showTouchControls, setShowTouchControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  // Detect mobile device or small screen
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;
      setIsMobile(isTouch);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { id: 'about_monument', label: '1. About Me', modal: 'about', coords: { x: 0, z: -50 } },
    { id: 'project_highway', label: '2. Projects', modal: 'projects', coords: { x: 100, z: 50 } },
    { id: 'skills_arena', label: '3. Skills Slalom', modal: 'skills', coords: { x: -80, z: 80 } },
    { id: 'web3_oasis', label: '4. Web3 Oasis', modal: 'garage', coords: { x: -120, z: -60 } },
    { id: 'contact_base', label: '5. Contact Pit', modal: 'contact', coords: { x: 50, z: -120 } },
  ];

  const visitedCount = STATIONS.filter(s => visitedLandmarks.includes(s.id)).length;

  const handleNextTourStation = () => {
    const nextIdx = (tourIndex + 1) % STATIONS.length;
    setTourIndex(nextIdx);
    const station = STATIONS[nextIdx];
    onFastTravel(station.coords.x, station.coords.z, station.modal);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-2 md:p-6 select-none overflow-hidden">
      
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between gap-2 pointer-events-auto flex-wrap">
        
        {/* Project Branding & Logo */}
        <div className="flex items-center gap-2 glass-panel px-3 py-1.5 md:px-4 md:py-2 rounded-2xl border border-cyan-500/40 shadow-lg">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-sm md:text-lg shadow-[0_0_15px_#00f0ff]">
            🏎️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] md:text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                3D WEB3
              </span>
              <span className="text-[9px] md:text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> LIVE
              </span>
            </div>
            <h1 className="text-xs md:text-sm font-extrabold text-white tracking-wide">
              Azad Singh
            </h1>
          </div>
        </div>

        {/* 5-Station Exploration Progress Tracker (Desktop) */}
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
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Guided Auto Tour Button for Phone/Mobile */}
          <button
            onClick={handleNextTourStation}
            className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 text-[10px] md:text-xs font-mono font-black shadow-[0_0_15px_rgba(255,209,102,0.4)] flex items-center gap-1 transition-all"
            title="Auto-drive to next landmark"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            <span>TOUR ➔</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 md:p-2 rounded-xl glass-panel text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md"
            title={isMuted ? 'Unmute Audio FX & Engine' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          {/* Camera Mode Toggle */}
          <button
            onClick={() => {
              const modes = ['chase', 'hood', 'top'];
              const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
              setCameraMode(modes[nextIdx]);
            }}
            className="p-1.5 md:px-3 md:py-2 rounded-xl glass-panel text-[10px] md:text-xs font-mono font-bold text-slate-300 hover:text-purple-400 border border-slate-700 hover:border-purple-500/50 transition-all shadow-md flex items-center gap-1"
            title="Switch Camera View Angle"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span className="uppercase hidden md:inline">{cameraMode} CAM</span>
          </button>

          {/* Web3 Wallet Connect Button */}
          <button
            onClick={onConnectWallet}
            className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-mono font-bold text-[10px] md:text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-1 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {walletAddress 
                ? `${walletAddress.slice(0, 5)}...${walletAddress.slice(-3)}` 
                : 'Wallet'}
            </span>
          </button>
        </div>

      </div>

      {/* ================= MOBILE QUICK STATION TAP BAR ================= */}
      <div className="flex lg:hidden items-center justify-center gap-1 overflow-x-auto py-1 px-1 pointer-events-auto">
        {STATIONS.map((station) => {
          const isDone = visitedLandmarks.includes(station.id);
          return (
            <button
              key={station.id}
              onClick={() => onFastTravel(station.coords.x, station.coords.z, station.modal)}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold whitespace-nowrap transition-all border ${
                isDone
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900/80 text-slate-400 border-slate-700'
              }`}
            >
              {station.label}
            </button>
          );
        })}
      </div>

      {/* ================= MIDDLE DRIFT / SPEED POPUP ================= */}
      {isDrifting && (
        <div className="self-center glass-panel-purple px-4 py-1.5 rounded-2xl border border-purple-500/60 shadow-[0_0_30px_rgba(157,78,221,0.6)] animate-bounce text-center pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-amber-300 block uppercase tracking-widest">
            🔥 DRIFT SLIDE
          </span>
          <span className="text-xl font-black font-mono text-white text-glow-purple">
            +{driftScore} PTS
          </span>
        </div>
      )}

      {/* ================= BOTTOM INSTRUMENT & CONTROLS ================= */}
      <div className="flex flex-col gap-2">
        
        {/* Desktop Instrument Panel + Minimap (hidden on very small phones to give space for touch controls) */}
        <div className="hidden md:flex items-end justify-between gap-4">
          
          {/* Speedometer & Car Telemetry Panel */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col gap-2.5 min-w-[220px] pointer-events-auto">
            {/* Top Info Row */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1 text-xs font-mono text-cyan-400">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                <span>TELEMETRY</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-mono text-slate-400">GEAR</span>
                <span className="w-5 h-5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-black text-[10px] flex items-center justify-center">
                  {gear}
                </span>
              </div>
            </div>

            {/* Speed Digital Readout */}
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black font-mono tracking-tight text-white text-glow-cyan">
                {speed}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">KM / H</span>
            </div>

            {/* Nitro Boost Meter */}
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-2.5 h-2.5 text-cyan-400" /> NITRO
                </span>
                <span>{Math.round(nitro)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-75 shadow-[0_0_10px_#00f0ff]"
                  style={{ width: `${nitro}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Minimap Radar */}
          <div className="pointer-events-auto">
            <Minimap
              carPos={carData?.pos}
              carRot={carData?.rotationY || 0}
              onFastTravel={onFastTravel}
            />
          </div>

        </div>

        {/* ================= MOBILE ON-SCREEN TOUCH DRIVING CONTROLS ================= */}
        {showTouchControls && (
          <MobileTouchControls
            onTouchKey={(key, isPressed) => setVirtualKey(key, isPressed)}
            onResetCar={onResetCar}
          />
        )}

      </div>

    </div>
  );
}
