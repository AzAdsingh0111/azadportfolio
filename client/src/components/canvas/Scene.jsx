import React, { useMemo } from 'react';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import { Track } from './Track';
import { Car } from './Car';
import { GhostCars } from './GhostCars';
import { AboutMonument } from './landmarks/AboutMonument';
import { ProjectHighway } from './landmarks/ProjectHighway';
import { SkillsArena } from './landmarks/SkillsArena';
import { Web3OasisGarage } from './landmarks/Web3OasisGarage';
import { ContactBase } from './landmarks/ContactBase';

export function Scene({
  carData,
  onCarUpdate,
  onDriftScore,
  cameraMode,
  teleportTarget,
  onTeleportComplete,
  activeModal,
  openModal,
  collectedSkills,
  onSkillHit,
  hasAccess,
  walletAddress,
  whispers
}) {
  // Calculate distances from car to all 5 stations
  const distances = useMemo(() => {
    const pos = carData?.pos || new THREE.Vector3(0, 0.4, -40);
    return {
      about_monument: pos.distanceTo(new THREE.Vector3(0, 0, -50)),
      project_highway: pos.distanceTo(new THREE.Vector3(100, 0, 50)),
      skills_arena: pos.distanceTo(new THREE.Vector3(-80, 0, 80)),
      web3_oasis: pos.distanceTo(new THREE.Vector3(-120, 0, -60)),
      contact_base: pos.distanceTo(new THREE.Vector3(50, 0, -120)),
    };
  }, [carData?.pos]);

  return (
    <>
      {/* Cyber Fog and Lighting */}
      <color attach="background" args={['#050811']} />
      <fog attach="fog" args={['#050811', 50, 320]} />

      <ambientLight intensity={0.65} color="#cbd5e1" />
      <directionalLight
        position={[80, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      <hemisphereLight skyColor="#00f0ff" groundColor="#0f172a" intensity={0.4} />

      {/* Cyber Space Stars */}
      <Stars radius={180} depth={60} count={3500} factor={4} saturation={0.5} fade speed={1.2} />

      {/* Infinite Grid Floor Plane */}
      <gridHelper args={[600, 100, '#00f0ff', '#1e293b']} position={[0, 0.01, 0]} />

      {/* Circuit Track & Environment */}
      <Track />

      {/* Active Driver Car */}
      <Car
        onCarUpdate={onCarUpdate}
        onDriftScore={onDriftScore}
        cameraMode={cameraMode}
        teleportTarget={teleportTarget}
        onTeleportComplete={onTeleportComplete}
      />

      {/* Holographic Multiplayer Ghost Cars */}
      <GhostCars
        myCarPos={carData?.pos}
        myCarRot={carData?.rotationY || 0}
        myWallet={walletAddress}
      />

      {/* 5 Landmark Stations */}
      <AboutMonument
        onTrigger={() => openModal('about')}
        distanceToCar={distances.about_monument}
      />

      <ProjectHighway
        onTrigger={() => openModal('projects')}
        distanceToCar={distances.project_highway}
      />

      <SkillsArena
        onTrigger={() => openModal('skills')}
        distanceToCar={distances.skills_arena}
        carPos={carData?.pos}
        onSkillHit={onSkillHit}
        collectedSkills={collectedSkills}
      />

      <Web3OasisGarage
        onTrigger={() => openModal('garage')}
        distanceToCar={distances.web3_oasis}
        hasAccess={hasAccess}
        walletAddress={walletAddress}
      />

      <ContactBase
        onTrigger={() => openModal('contact')}
        distanceToCar={distances.contact_base}
        whispers={whispers}
      />
    </>
  );
}
