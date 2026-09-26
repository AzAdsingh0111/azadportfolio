import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

export function ContactBase({ onTrigger, distanceToCar, whispers = [] }) {
  const isNear = distanceToCar < 22;
  const recentWhisper = whispers.length > 0 ? whispers[0] : null;

  return (
    <group position={[50, 0, -120]}>
      {/* Pit Stop Platform Foundation */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[26, 0.3, 18]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Pit Lane Neon Curbs */}
      <mesh position={[0, 0.35, 9]}>
        <boxGeometry args={[26, 0.4, 0.5]} />
        <meshBasicMaterial color="#f72585" />
      </mesh>
      <mesh position={[0, 0.35, -9]}>
        <boxGeometry args={[26, 0.4, 0.5]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Futuristic Pit Stop Canopy Pillars */}
      <mesh position={[-11, 4, -7]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 8, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      <mesh position={[11, 4, -7]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 8, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* Canopy Roof Structure */}
      <mesh position={[0, 8, -2]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[24, 0.4, 14]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Holographic Whisper Wall Billboard */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group position={[0, 5, -8]}>
          <mesh>
            <boxGeometry args={[16, 5, 0.3]} />
            <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[15.6, 4.6]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.1} />
          </mesh>

          {/* Whisper Text Live Display */}
          <Html position={[0, 0, 0.25]} center distanceFactor={18} transform>
            <div 
              onClick={onTrigger}
              className="w-96 p-4 bg-slate-900/90 rounded-xl border border-cyan-400/50 shadow-2xl cursor-pointer hover:border-cyan-300 transition-all text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                  <span className="text-xs font-mono font-bold text-pink-400">ON-CHAIN WHISPER WALL</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Live Pit Feed</span>
              </div>
              {recentWhisper ? (
                <div>
                  <p className="text-xs text-slate-200 italic line-clamp-2">"{recentWhisper.message}"</p>
                  <div className="flex items-center justify-between mt-2 pt-1 text-[10px] font-mono text-cyan-300">
                    <span>✍️ {recentWhisper.author}</span>
                    <span className="text-emerald-400">✓ Cryptographically Signed</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No whispers yet. Sign the guestbook now!</p>
              )}
            </div>
          </Html>
        </group>
      </Float>

      {/* Main Overhead Station Trigger Banner */}
      <Html position={[0, 11, 0]} center distanceFactor={24}>
        <div 
          onClick={onTrigger}
          className={`cursor-pointer transition-all duration-300 transform ${
            isNear ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center bg-slate-900/90 border border-pink-500/70 px-4 py-2 rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(247,37,133,0.5)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-pink-400">STATION 5</span>
            </div>
            <h3 className="text-sm font-bold text-white whitespace-nowrap mt-0.5">Contact Pit Stop</h3>
            <p className="text-[11px] text-pink-200/90 font-mono">
              {isNear ? '⚡ PRESS [E] TO SIGN GUESTBOOK & CONNECT' : `📍 ${Math.round(distanceToCar)}m AWAY`}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}
