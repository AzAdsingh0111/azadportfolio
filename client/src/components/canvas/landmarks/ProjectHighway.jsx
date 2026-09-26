import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS_DATA = [
  {
    id: 'cartographer',
    title: 'Cartographer',
    badge: '🏆 TEAM BYTEX HACKATHON WINNER (4th Place)',
    subtitle: 'Hidden Location & Vibe Mapping System',
    posOffset: [-24, 0, -20],
    color: '#ffd166',
    border: 'border-amber-400'
  },
  {
    id: 'panel-room',
    title: 'Panel Room Meeting System',
    badge: 'ENTERPRISE ARCHITECTURE',
    subtitle: 'Real-time Conference & Room Orchestrator',
    posOffset: [-8, 0, -5],
    color: '#00f0ff',
    border: 'border-cyan-400'
  },
  {
    id: 'xmpp-server',
    title: 'XMPP Real-Time Server',
    badge: 'DISTRIBUTED PROTOCOL',
    subtitle: 'High-throughput Messaging & Event Dispatcher',
    posOffset: [8, 0, 10],
    color: '#9d4edd',
    border: 'border-purple-400'
  },
  {
    id: 'web-showcase',
    title: 'Full-Stack Web Suite',
    badge: 'MODERN WEB APPS',
    subtitle: 'High Performance Dashboards & WebGL UIs',
    posOffset: [24, 0, 25],
    color: '#10b981',
    border: 'border-emerald-400'
  }
];

export function ProjectHighway({ onTrigger, distanceToCar }) {
  const isNear = distanceToCar < 26;

  return (
    <group position={[100, 0, 50]}>
      {/* Highway Ground Strip */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[70, 0.3, 14]} />
        <meshStandardMaterial color="#0b132b" roughness={0.4} />
      </mesh>

      {/* Glowing Highway Guardrails */}
      <mesh position={[0, 0.8, -7]}>
        <boxGeometry args={[70, 0.6, 0.3]} />
        <meshStandardMaterial color="#9d4edd" emissive="#9d4edd" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 0.8, 7]}>
        <boxGeometry args={[70, 0.6, 0.3]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} />
      </mesh>

      {/* Main Station Trigger Billboard Overhead */}
      <Html position={[0, 11, 0]} center distanceFactor={26}>
        <div 
          onClick={onTrigger}
          className={`cursor-pointer transition-all duration-300 transform ${
            isNear ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center bg-slate-900/90 border border-purple-500/70 px-5 py-2.5 rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(157,78,221,0.5)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-purple-400">STATION 2</span>
            </div>
            <h3 className="text-base font-bold text-white whitespace-nowrap mt-0.5">Project Highway</h3>
            <p className="text-[11px] text-purple-200/90 font-mono">
              {isNear ? '⚡ PRESS [E] OR CLICK FOR ALL 4 BUILDS' : `📍 ${Math.round(distanceToCar)}m AWAY`}
            </p>
          </div>
        </div>
      </Html>

      {/* 4 3D Holographic Billboards */}
      {PROJECTS_DATA.map((proj, idx) => (
        <group key={proj.id} position={proj.posOffset}>
          {/* Billboard Pillars */}
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 6, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* Billboard 3D Display Frame */}
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh position={[0, 6, 0]} castShadow>
              <boxGeometry args={[7, 4, 0.4]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Glowing Screen Face */}
            <mesh position={[0, 6, 0.22]}>
              <planeGeometry args={[6.6, 3.6]} />
              <meshBasicMaterial color={proj.color} transparent opacity={0.15} />
            </mesh>
          </Float>

          {/* Holographic Text HTML on Billboard */}
          <Html position={[0, 6, 0.4]} center distanceFactor={20} transform>
            <div 
              onClick={onTrigger}
              className={`w-64 p-3 bg-slate-900/95 rounded-lg border ${proj.border} shadow-lg cursor-pointer hover:scale-105 transition-all`}
            >
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 block mb-1">
                {proj.badge}
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">{proj.title}</h4>
              <p className="text-[10px] text-slate-300 mt-1 line-clamp-2">{proj.subtitle}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
