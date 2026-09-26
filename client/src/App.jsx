import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { Scene } from './components/canvas/Scene';
import { HUD } from './components/hud/HUD';
import { AboutModal } from './components/modals/AboutModal';
import { ProjectsModal } from './components/modals/ProjectsModal';
import { SkillsModal } from './components/modals/SkillsModal';
import { GarageModal } from './components/modals/GarageModal';
import { ContactWhisperModal } from './components/modals/ContactWhisperModal';

import { soundManager } from './utils/audio';
import { web3Service } from './utils/web3';

export default function App() {
  // Car Simulation Telemetry State
  const [carData, setCarData] = useState({
    pos: new THREE.Vector3(0, 0.4, -40),
    rotationY: 0,
    speedKmH: 0,
    isDrifting: false,
    driftScore: 0,
    nitro: 100,
  });

  // Camera & Audio State
  const [cameraMode, setCameraMode] = useState('chase');
  const [isMuted, setIsMuted] = useState(false);

  // Fast Travel State
  const [teleportTarget, setTeleportTarget] = useState(null);

  // Landmark Exploration Tracking State
  const [visitedLandmarks, setVisitedLandmarks] = useState(['about_monument']); // initial spawn landmark
  const [activeModal, setActiveModal] = useState(null);

  // Skills Slalom Unlocked Tokens
  const [collectedSkills, setCollectedSkills] = useState(['cpp', 'data_analysis']);

  // Web3 State
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasAccess, setHasAccess] = useState(true); // Team BYTEX NFT Pass
  const [whispers, setWhispers] = useState([]);

  // Initialize Web3 & Fetch Live Whispers
  useEffect(() => {
    const initWeb3AndWhispers = async () => {
      const res = await web3Service.connectWallet();
      if (res && res.account) {
        setWalletAddress(res.account);
      }
      const fetchedWhispers = await web3Service.fetchWhispers();
      if (fetchedWhispers && fetchedWhispers.length > 0) {
        setWhispers(fetchedWhispers);
      }
    };
    initWeb3AndWhispers();
  }, []);

  // Update Car Data and Check Landmark Proximity
  const handleCarUpdate = useCallback((data) => {
    setCarData(data);

    if (!data.pos) return;

    // Check proximity to all 5 stations and auto-mark as visited
    const stationCoords = [
      { id: 'about_monument', pos: new THREE.Vector3(0, 0, -50), range: 18 },
      { id: 'project_highway', pos: new THREE.Vector3(100, 0, 50), range: 28 },
      { id: 'skills_arena', pos: new THREE.Vector3(-80, 0, 80), range: 28 },
      { id: 'web3_oasis', pos: new THREE.Vector3(-120, 0, -60), range: 26 },
      { id: 'contact_base', pos: new THREE.Vector3(50, 0, -120), range: 24 },
    ];

    stationCoords.forEach((st) => {
      if (data.pos.distanceTo(st.pos) < st.range) {
        setVisitedLandmarks((prev) => {
          if (!prev.includes(st.id)) {
            soundManager.playCheckpointChime();
            return [...prev, st.id];
          }
          return prev;
        });
      }
    });
  }, []);

  // Handle Drift Score Accrual
  const handleDriftScore = useCallback((score) => {
    setCarData((prev) => ({ ...prev, driftScore: score }));
  }, []);

  // Handle Skill Target Collision
  const handleSkillHit = useCallback((skillId, skillName) => {
    setCollectedSkills((prev) => {
      if (!prev.includes(skillId)) {
        return [...prev, skillId];
      }
      return prev;
    });
  }, []);

  // Toggle Audio Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Connect Web3 Wallet
  const handleConnectWallet = async () => {
    const res = await web3Service.connectWallet();
    if (res && res.account) {
      setWalletAddress(res.account);
    }
    return res;
  };

  // Fast Travel Teleport to Landmark
  const handleFastTravel = (x, z, landmarkId) => {
    soundManager.playNitroBoost();
    setTeleportTarget({ x, z });
    const modalMapping = {
      about: 'about',
      projects: 'projects',
      skills: 'skills',
      garage: 'garage',
      contact: 'contact',
    };
    if (modalMapping[landmarkId]) {
      setTimeout(() => {
        setActiveModal(modalMapping[landmarkId]);
      }, 400);
    }
  };

  // Add a newly signed whisper
  const handleWhisperAdded = (newWhisper) => {
    setWhispers((prev) => [newWhisper, ...prev]);
  };

  // Global Keyboard shortcut 'E' to open nearest landmark modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'e' && !activeModal) {
        if (!carData.pos) return;
        const pos = carData.pos;
        if (pos.distanceTo(new THREE.Vector3(0, 0, -50)) < 22) setActiveModal('about');
        else if (pos.distanceTo(new THREE.Vector3(100, 0, 50)) < 30) setActiveModal('projects');
        else if (pos.distanceTo(new THREE.Vector3(-80, 0, 80)) < 30) setActiveModal('skills');
        else if (pos.distanceTo(new THREE.Vector3(-120, 0, -60)) < 30) setActiveModal('garage');
        else if (pos.distanceTo(new THREE.Vector3(50, 0, -120)) < 26) setActiveModal('contact');
      } else if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carData.pos, activeModal]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050811]">
      
      {/* 3D WebGL Canvas Viewport */}
      <Canvas
        shadows
        camera={{ position: [0, 5, -55], fov: 60 }}
        className="w-full h-full"
      >
        <Scene
          carData={carData}
          onCarUpdate={handleCarUpdate}
          onDriftScore={handleDriftScore}
          cameraMode={cameraMode}
          teleportTarget={teleportTarget}
          onTeleportComplete={() => setTeleportTarget(null)}
          activeModal={activeModal}
          openModal={(modalName) => setActiveModal(modalName)}
          collectedSkills={collectedSkills}
          onSkillHit={handleSkillHit}
          hasAccess={hasAccess}
          walletAddress={walletAddress}
          whispers={whispers}
        />
      </Canvas>

      {/* Cyberpunk HUD Overlay */}
      <HUD
        carData={carData}
        cameraMode={cameraMode}
        setCameraMode={setCameraMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        hasAccess={hasAccess}
        setHasAccess={setHasAccess}
        visitedLandmarks={visitedLandmarks}
        collectedSkills={collectedSkills}
        onOpenModal={(modal) => setActiveModal(modal)}
        onFastTravel={handleFastTravel}
      />

      {/* 5 Interactive Landmark Modals */}
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={() => setActiveModal(null)}
      />

      <ProjectsModal
        isOpen={activeModal === 'projects'}
        onClose={() => setActiveModal(null)}
      />

      <SkillsModal
        isOpen={activeModal === 'skills'}
        onClose={() => setActiveModal(null)}
        collectedSkills={collectedSkills}
      />

      <GarageModal
        isOpen={activeModal === 'garage'}
        onClose={() => setActiveModal(null)}
        hasAccess={hasAccess}
        setHasAccess={setHasAccess}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        visitedLandmarks={visitedLandmarks}
      />

      <ContactWhisperModal
        isOpen={activeModal === 'contact'}
        onClose={() => setActiveModal(null)}
        whispers={whispers}
        onWhisperAdded={handleWhisperAdded}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />

    </div>
  );
}
