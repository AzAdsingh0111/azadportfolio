import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { TRACK_WAYPOINTS } from './Track';

export function GhostCarSingle({ targetPos, targetRot, walletAddress, color = '#38bdf8' }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current && targetPos && targetRot) {
      meshRef.current.position.lerp(new THREE.Vector3(...targetPos), Math.min(delta * 10, 1.0));
      meshRef.current.quaternion.slerp(new THREE.Quaternion(...targetRot), Math.min(delta * 10, 1.0));
    }
  });

  const shortAddr = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Ghost Racer';

  return (
    <group ref={meshRef} position={targetPos || [0, 0.4, 0]}>
      {/* Holographic Wireframe Cyber Chassis */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 0.5, 4.0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.45}
          wireframe
        />
      </mesh>

      {/* Cockpit Hologram */}
      <mesh position={[0, 0.4, -0.2]}>
        <boxGeometry args={[1.3, 0.4, 1.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Floating Driver Wallet Tag */}
      <Html position={[0, 1.8, 0]} center distanceFactor={18}>
        <div className="px-2 py-0.5 bg-slate-950/80 text-cyan-300 text-[10px] font-mono rounded border border-cyan-500/40 backdrop-blur whitespace-nowrap shadow-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{shortAddr}</span>
        </div>
      </Html>
    </group>
  );
}

export function GhostCars({ myCarPos, myCarRot, myWallet }) {
  const [remotePlayers, setRemotePlayers] = useState({});
  const socketRef = useRef(null);

  // Fallback / Standalone Bot Ghost Racers
  const [botDrivers] = useState(() => [
    {
      id: 'bot_bytex_champion',
      wallet: '0xBYTEX...4thWinner',
      color: '#ffd166',
      trackProgress: 0.25,
      speed: 0.015,
      pos: [100, 0.4, 50],
      rot: [0, 0, 0, 1]
    },
    {
      id: 'bot_polygon_explorer',
      wallet: '0xPolygon...892A',
      color: '#9d4edd',
      trackProgress: 0.65,
      speed: 0.018,
      pos: [-80, 0.4, 80],
      rot: [0, 0, 0, 1]
    }
  ]);

  // Track Curve for bots
  const trackCurve = useRef(new THREE.CatmullRomCurve3(TRACK_WAYPOINTS, true, 'centripetal', 0.5));

  // Connect WebSocket for live multiplayer
  useEffect(() => {
    let ws;
    try {
      // Determine WebSocket URL safely
      const wsUrl = import.meta.env.VITE_WS_URL || (typeof window !== 'undefined' && window.location.protocol === 'http:' ? 'ws://localhost:8000/ws/multiplayer' : null);
      if (wsUrl) {
        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({
            type: 'join',
            wallet: myWallet || '0xExplorerGuest'
          }));
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'playerMoved') {
              setRemotePlayers(prev => ({
                ...prev,
                [msg.id]: msg
              }));
            } else if (msg.type === 'playerLeft') {
              setRemotePlayers(prev => {
                const updated = { ...prev };
                delete updated[msg.id];
                return updated;
              });
            } else if (msg.type === 'currentPlayers') {
              setRemotePlayers(msg.players || {});
            }
          } catch (e) {}
        };

        ws.onerror = () => {};
      }
    } catch (e) {}

    return () => {
      if (ws) {
        try { ws.close(); } catch(e) {}
      }
    };
  }, [myWallet]);

  // Broadcast own position periodically
  useEffect(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !myCarPos) return;

    const interval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'updateTransform',
          pos: [myCarPos.x, myCarPos.y, myCarPos.z],
          rot: [0, Math.sin(myCarRot / 2), 0, Math.cos(myCarRot / 2)],
          wallet: myWallet || '0xExplorerGuest'
        }));
      }
    }, 50); // 20 Hz

    return () => clearInterval(interval);
  }, [myCarPos, myCarRot, myWallet]);

  // Animate standalone bot drivers
  useFrame((_, delta) => {
    botDrivers.forEach(bot => {
      bot.trackProgress = (bot.trackProgress + bot.speed * delta) % 1.0;
      const point = trackCurve.current.getPointAt(bot.trackProgress);
      const tangent = trackCurve.current.getTangentAt(bot.trackProgress);
      bot.pos = [point.x, 0.4, point.z];
      const angle = Math.atan2(tangent.x, tangent.z);
      bot.rot = [0, Math.sin(angle / 2), 0, Math.cos(angle / 2)];
    });
  });

  return (
    <group>
      {/* Render Real WebSocket Remote Players */}
      {Object.values(remotePlayers).map(player => (
        <GhostCarSingle
          key={player.id}
          targetPos={player.pos}
          targetRot={player.rot}
          walletAddress={player.wallet}
          color={player.color || '#38bdf8'}
        />
      ))}

      {/* Render Bot Ghost Racers */}
      {botDrivers.map(bot => (
        <GhostCarSingle
          key={bot.id}
          targetPos={bot.pos}
          targetRot={bot.rot}
          walletAddress={bot.wallet}
          color={bot.color}
        />
      ))}
    </group>
  );
}
