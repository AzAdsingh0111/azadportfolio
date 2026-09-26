import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

export function AboutMonument({ onTrigger, distanceToCar }) {
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const crystalRef = useRef();
  const isNear = distanceToCar < 16;

  useFrame((_, delta) => {
    if (outerRingRef.current) outerRingRef.current.rotation.y += delta * 0.8;
    if (innerRingRef.current) innerRingRef.current.rotation.x -= delta * 1.2;
    if (crystalRef.current) crystalRef.current.rotation.y += delta * 0.5;
  });

  return (
    <group position={[0, 0, -50]}>
      {/* Base Platform */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[10, 12, 0.5, 32]} />
        <meshStandardMaterial color="#0b1329" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Neon Cyber Trim */}
      <mesh position={[0, 0.5, 0]}>
        <ringGeometry args={[9.5, 10, 32]} />
        <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Energy Light Beam */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 30, 16]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>

      {/* Floating Monolith Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, 5, 0]}>
          <mesh ref={crystalRef} castShadow>
            <octahedronGeometry args={[2.5, 0]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00b4d8"
              emissiveIntensity={0.8}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Outer Gyro Ring */}
          <mesh ref={outerRingRef}>
            <torusGeometry args={[4.2, 0.12, 16, 64]} />
            <meshStandardMaterial color="#9d4edd" emissive="#7b2cbf" emissiveIntensity={0.6} />
          </mesh>

          {/* Inner Gyro Ring */}
          <mesh ref={innerRingRef}>
            <torusGeometry args={[3.2, 0.1, 16, 64]} />
            <meshStandardMaterial color="#ffd166" emissive="#f39c12" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </Float>

      {/* Proximity Floating HUD Badge */}
      <Html position={[0, 9, 0]} center distanceFactor={22}>
        <div 
          onClick={onTrigger}
          className={`cursor-pointer transition-all duration-300 transform ${
            isNear ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center bg-slate-900/90 border border-cyan-400/60 px-4 py-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400">STATION 1</span>
            </div>
            <h3 className="text-sm font-bold text-white whitespace-nowrap mt-0.5">About Me Monument</h3>
            <p className="text-[11px] text-cyan-200/80 font-mono">
              {isNear ? '⚡ PRESS [E] OR CLICK TO OPEN' : `📍 ${Math.round(distanceToCar)}m AWAY`}
            </p>
          </div>
        </div>
      </Html>
    </group>
  );
}
