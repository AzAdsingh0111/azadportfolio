import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { soundManager } from '../../../utils/audio';

export const INITIAL_SKILLS = [
  { id: 'cpp', name: 'C++', category: 'Languages', color: '#00f0ff', pos: [-14, 1.5, -12], hit: false },
  { id: 'java', name: 'Java', category: 'Languages', color: '#ffd166', pos: [-7, 1.5, -4], hit: false },
  { id: 'sql', name: 'SQL', category: 'Databases', color: '#10b981', pos: [0, 1.5, 4], hit: false },
  { id: 'html_css', name: 'HTML5 & CSS3', category: 'Web Dev', color: '#f72585', pos: [7, 1.5, 12], hit: false },
  { id: 'xmpp', name: 'XMPP Protocol', category: 'Distributed', color: '#9d4edd', pos: [14, 1.5, 4], hit: false },
  { id: 'data_analysis', name: 'Data Analysis', category: 'Data Science', color: '#38bdf8', pos: [7, 1.5, -8], hit: false },
  { id: 'data_viz', name: 'Data Visualization', category: 'Data Science', color: '#ec4899', pos: [-2, 1.5, -14], hit: false },
  { id: 'bio_research', name: 'Lab Research Methods', category: 'Academic Bio', color: '#a3e635', pos: [-10, 1.5, 10], hit: false },
];

export function SkillsArena({ onTrigger, distanceToCar, carPos, onSkillHit, collectedSkills }) {
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const isNear = distanceToCar < 26;

  useFrame(() => {
    if (!carPos) return;

    // Detect collision between car position and uncollected skill targets
    skills.forEach((skill) => {
      if (!collectedSkills.includes(skill.id)) {
        const targetWorldX = -80 + skill.pos[0];
        const targetWorldZ = 80 + skill.pos[2];
        const dx = carPos.x - targetWorldX;
        const dz = carPos.z - targetWorldZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 3.2) {
          // Smash hit!
          soundManager.playSkillSmash();
          onSkillHit(skill.id, skill.name);
        }
      }
    });
  });

  return (
    <group position={[-80, 0, 80]}>
      {/* Slalom Bend Arena Floor Platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[26, 28, 0.3, 32]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Cyber Neon Boundary Rings */}
      <mesh position={[0, 0.3, 0]}>
        <ringGeometry args={[25, 26, 32]} />
        <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
      </mesh>

      {/* Main Overhead Station Banner */}
      <Html position={[0, 10, 0]} center distanceFactor={24}>
        <div 
          onClick={onTrigger}
          className={`cursor-pointer transition-all duration-300 transform ${
            isNear ? 'scale-110' : 'scale-90 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex flex-col items-center bg-slate-900/90 border border-emerald-500/70 px-4 py-2.5 rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.5)]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">STATION 3</span>
            </div>
            <h3 className="text-sm font-bold text-white whitespace-nowrap mt-0.5">Skills Slalom Arena</h3>
            <p className="text-[11px] text-emerald-200/90 font-mono">
              💥 SMASH ORBS WITH CAR ({collectedSkills.length}/{INITIAL_SKILLS.length} COLLECTED)
            </p>
          </div>
        </div>
      </Html>

      {/* Smashable 3D Skill Slalom Targets */}
      {skills.map((skill) => {
        const isCollected = collectedSkills.includes(skill.id);

        return (
          <group key={skill.id} position={skill.pos}>
            {/* Glowing Base Beacon Ring */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.5, 16]} />
              <meshBasicMaterial 
                color={isCollected ? '#334155' : skill.color} 
                transparent 
                opacity={isCollected ? 0.3 : 0.9} 
              />
            </mesh>

            {!isCollected ? (
              <Float speed={3} rotationIntensity={1} floatIntensity={0.8}>
                {/* 3D Polyhedron Skill Orb */}
                <mesh position={[0, 1.2, 0]}>
                  <icosahedronGeometry args={[1.1, 0]} />
                  <meshStandardMaterial
                    color={skill.color}
                    emissive={skill.color}
                    emissiveIntensity={0.7}
                    metalness={0.9}
                    roughness={0.2}
                    wireframe={false}
                  />
                </mesh>

                {/* Floating Skill Badge Tag */}
                <Html position={[0, 2.8, 0]} center distanceFactor={16}>
                  <div className="px-2.5 py-1 bg-slate-900/90 border border-emerald-400/80 rounded-lg text-center backdrop-blur shadow-md pointer-events-none">
                    <span className="text-[11px] font-bold text-white block leading-tight">{skill.name}</span>
                    <span className="text-[9px] font-mono text-emerald-300 uppercase">{skill.category}</span>
                  </div>
                </Html>
              </Float>
            ) : (
              // Collected Ghost Placeholder
              <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
                <meshStandardMaterial color="#10b981" transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
