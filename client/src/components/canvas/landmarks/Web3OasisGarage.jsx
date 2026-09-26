import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export function Web3OasisGarage({ onTrigger, distanceToCar, hasAccess, walletAddress }) {
  const trophyRef = useRef();
  const barrierRef = useRef();
  const isNear = distanceToCar < 24;

  useFrame((_, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * 1.5;
    }
    if (barrierRef.current && !hasAccess) {
      barrierRef.current.material.opacity = 0.6 + Math.sin(Date.now() * 0.005) * 0.2;
    }
  });

  return (
    <group position={[-120, 0, -60]}>
      {/* Garage Floor Foundation */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[28, 0.3, 24]} />
        <meshStandardMaterial color="#080c14" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Garage Cyber Dome Structure Walls */}
      <mesh position={[0, 5, -12]}>
        <boxGeometry args={[28, 10, 1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[-14, 5, 0]}>
        <boxGeometry args={[1, 10, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>
      <mesh position={[14, 5, 0]}>
        <boxGeometry args={[1, 10, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} />
      </mesh>

      {/* Garage Roof with Neon Skylight */}
      <mesh position={[0, 10.2, 0]}>
        <boxGeometry args={[28, 0.4, 24]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      <mesh position={[0, 10.1, 0]}>
        <boxGeometry args={[24, 0.1, 20]} />
        <meshBasicMaterial color={hasAccess ? '#10b981' : '#f72585'} transparent opacity={0.3} />
      </mesh>

      {/* Token-Gated Dynamic Security Energy Barrier */}
      <group position={[0, 4.5, 12]}>
        <mesh ref={barrierRef}>
          <boxGeometry args={[26, 9, 0.4]} />
          <meshStandardMaterial
            color={hasAccess ? '#10b981' : '#ef4444'}
            emissive={hasAccess ? '#10b981' : '#ef4444'}
            emissiveIntensity={0.8}
            transparent
            opacity={hasAccess ? 0.25 : 0.75}
            wireframe={!hasAccess}
          />
        </mesh>

        {/* Barrier Status Text */}
        <Html position={[0, 2, 0.5]} center distanceFactor={20}>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 backdrop-blur-md shadow-xl text-center">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              hasAccess ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-400' : 'bg-rose-500/30 text-rose-400 border border-rose-400'
            }`}>
              {hasAccess ? '🔓 TOKEN-GATE UNLOCKED' : '🔒 TOKEN-GATED BARRIER ACTIVE'}
            </span>
            <p className="text-[10px] text-slate-300 mt-1 font-mono">
              {hasAccess ? 'Team BYTEX Pass Verified' : 'Team BYTEX Hackathon Pass Required'}
            </p>
          </div>
        </Html>
      </group>

      {/* Inside Garage: 3D Team BYTEX Championship Trophy */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[0, 3.5, 0]}>
          {/* Trophy Stand */}
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[2, 2.5, 1, 16]} />
            <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Golden Trophy Cup */}
          <group ref={trophyRef}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[1.5, 0.4, 2, 16]} />
              <meshStandardMaterial
                color="#ffd166"
                emissive="#f59e0b"
                emissiveIntensity={0.5}
                metalness={1.0}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <torusGeometry args={[1.2, 0.15, 16, 32]} />
              <meshStandardMaterial color="#ffd166" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 2, 0]}>
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Main Overhead Station Trigger Banner */}
      <Html position={[0, 12, 0]} center distanceFactor={26}>
        <div 
          onClick={onTrigger}
          className={`cursor-pointer transition-all duration-300 transform ${
            isNear ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center bg-slate-900/90 border border-amber-400/80 px-5 py-2.5 rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(255,209,102,0.5)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-amber-400">STATION 4</span>
            </div>
            <h3 className="text-sm font-bold text-white whitespace-nowrap mt-0.5">Web3 Oasis & Garage</h3>
            <p className="text-[11px] text-amber-200/90 font-mono">
              {isNear ? '🏆 CLAIM PROOF OF EXPLORATION BADGE' : `📍 ${Math.round(distanceToCar)}m AWAY`}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}
