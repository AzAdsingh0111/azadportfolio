import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../utils/audio';

// Keyboard & Touch control state
export const activeKeys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  brake: false,
  boost: false,
};

export const setVirtualKey = (keyName, isPressed) => {
  if (keyName in activeKeys) {
    activeKeys[keyName] = isPressed;
  }
};

export function Car({ 
  onCarUpdate, 
  onDriftScore, 
  cameraMode = 'chase', 
  teleportTarget = null,
  onTeleportComplete = () => {},
  isAutoTour = false
}) {
  const carGroup = useRef();
  const frontLeftWheel = useRef();
  const frontRightWheel = useRef();
  const backLeftWheel = useRef();
  const backRightWheel = useRef();
  const nitroParticlesRef = useRef();

  // Car Physics State
  const [carState] = useState(() => ({
    pos: new THREE.Vector3(0, 0.4, -40),
    vel: new THREE.Vector3(0, 0, 0),
    rotationY: 0,
    speed: 0,
    steerAngle: 0,
    driftScore: 0,
    isDrifting: false,
    nitro: 100,
  }));

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      soundManager.init(); // Initialize audio on first user gesture
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.forward = true;
      if (key === 's' || key === 'arrowdown') keys.backward = true;
      if (key === 'a' || key === 'arrowleft') keys.left = true;
      if (key === 'd' || key === 'arrowright') keys.right = true;
      if (key === ' ' || key === 'space') {
        keys.brake = true;
        e.preventDefault();
      }
      if (key === 'shift') keys.boost = true;
      if (key === 'r') {
        // Reset Car
        carState.pos.set(0, 0.4, -40);
        carState.vel.set(0, 0, 0);
        carState.speed = 0;
        carState.rotationY = 0;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') keys.forward = false;
      if (key === 's' || key === 'arrowdown') keys.backward = false;
      if (key === 'a' || key === 'arrowleft') keys.left = false;
      if (key === 'd' || key === 'arrowright') keys.right = false;
      if (key === ' ' || key === 'space') keys.brake = false;
      if (key === 'shift') keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [carState]);

  // Handle Fast Travel / Teleportation
  useEffect(() => {
    if (teleportTarget) {
      carState.pos.set(teleportTarget.x, 0.4, teleportTarget.z);
      carState.speed = 0;
      carState.vel.set(0, 0, 0);
      onTeleportComplete();
    }
  }, [teleportTarget]);

  // Simulation Frame Loop
  useFrame((state, delta) => {
    if (!carGroup.current) return;

    const dt = Math.min(delta, 0.1);

    // Acceleration & Braking Parameters
    const ACCEL = 35.0;
    const BOOST_ACCEL = 65.0;
    const BRAKE_DECEL = 45.0;
    const isForward = keys.forward || activeKeys.forward;
    const isBackward = keys.backward || activeKeys.backward;
    const isLeft = keys.left || activeKeys.left;
    const isRight = keys.right || activeKeys.right;
    const isHandbraking = keys.brake || activeKeys.brake;
    const isBoosting = keys.boost || activeKeys.boost;

    const FRICTION = 0.985;
    const MAX_SPEED = isBoosting && carState.nitro > 0 ? 55.0 : 38.0;
    const MAX_REVERSE = -14.0;
    const STEER_SPEED = 2.4;
    const MAX_STEER = 0.55;

    // Nitro consumption
    if (isBoosting && isForward && carState.nitro > 0) {
      carState.nitro = Math.max(0, carState.nitro - dt * 25);
      soundManager.playNitroBoost();
    } else {
      carState.nitro = Math.min(100, carState.nitro + dt * 10);
    }

    // Forward / Backward thrust
    const currentAccel = (isBoosting && carState.nitro > 0) ? BOOST_ACCEL : ACCEL;
    if (isForward) {
      carState.speed += currentAccel * dt;
    } else if (isBackward) {
      if (carState.speed > 0) {
        carState.speed -= BRAKE_DECEL * dt;
      } else {
        carState.speed -= ACCEL * 0.6 * dt;
      }
    } else {
      carState.speed *= FRICTION;
    }

    // Handbrake Drifting
    if (isHandbraking) {
      carState.speed *= 0.96;
      if (Math.abs(carState.speed) > 10 && Math.abs(carState.steerAngle) > 0.15) {
        carState.isDrifting = true;
        carState.driftScore += Math.round(Math.abs(carState.speed) * 10 * dt);
        soundManager.playDriftScreech();
        onDriftScore(carState.driftScore);
      } else {
        carState.isDrifting = false;
      }
    } else {
      carState.isDrifting = false;
    }

    // Clamp speed
    carState.speed = THREE.MathUtils.clamp(carState.speed, MAX_REVERSE, MAX_SPEED);

    // Steering
    const targetSteer = isLeft ? MAX_STEER : isRight ? -MAX_STEER : 0;
    carState.steerAngle = THREE.MathUtils.lerp(carState.steerAngle, targetSteer, STEER_SPEED * dt * 4);

    // Apply rotation based on speed and steer angle
    if (Math.abs(carState.speed) > 0.1) {
      const turnMultiplier = (isHandbraking ? 1.8 : 1.0) * (carState.speed >= 0 ? 1 : -1);
      carState.rotationY += carState.steerAngle * (carState.speed / MAX_SPEED) * turnMultiplier * 2.8 * dt;
    }

    // Update Position
    const forwardX = Math.sin(carState.rotationY);
    const forwardZ = Math.cos(carState.rotationY);

    carState.pos.x += forwardX * carState.speed * dt;
    carState.pos.z += forwardZ * carState.speed * dt;

    // Apply to 3D Mesh
    carGroup.current.position.copy(carState.pos);
    carGroup.current.rotation.y = carState.rotationY;

    // Front Wheels Steering Angle
    if (frontLeftWheel.current) frontLeftWheel.current.rotation.y = carState.steerAngle;
    if (frontRightWheel.current) frontRightWheel.current.rotation.y = carState.steerAngle;

    // Wheels Rolling Rotation
    const wheelRot = (carState.speed * dt) / 0.4;
    [frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel].forEach(ref => {
      if (ref.current) ref.current.rotation.x += wheelRot;
    });

    // Audio Update
    const speedKmH = Math.round(carState.speed * 3.6);
    soundManager.updateEngine(speedKmH, keys.forward, keys.backward || keys.brake);

    // Camera Modes
    if (cameraMode === 'chase') {
      const cameraOffset = new THREE.Vector3(
        carState.pos.x - forwardX * 9,
        carState.pos.y + 3.8,
        carState.pos.z - forwardZ * 9
      );
      state.camera.position.lerp(cameraOffset, 0.1);
      state.camera.lookAt(carState.pos.x, carState.pos.y + 1.2, carState.pos.z);
    } else if (cameraMode === 'hood') {
      const hoodOffset = new THREE.Vector3(
        carState.pos.x + forwardX * 1.2,
        carState.pos.y + 1.2,
        carState.pos.z + forwardZ * 1.2
      );
      state.camera.position.copy(hoodOffset);
      state.camera.lookAt(carState.pos.x + forwardX * 20, carState.pos.y + 1.0, carState.pos.z + forwardZ * 20);
    } else if (cameraMode === 'top') {
      const topOffset = new THREE.Vector3(carState.pos.x, carState.pos.y + 35, carState.pos.z + 10);
      state.camera.position.lerp(topOffset, 0.1);
      state.camera.lookAt(carState.pos.x, carState.pos.y, carState.pos.z);
    }

    // Notify Parent (HUD, Minimap, Milestones, WebSocket)
    onCarUpdate({
      pos: carState.pos,
      rotationY: carState.rotationY,
      speedKmH: Math.abs(speedKmH),
      isDrifting: carState.isDrifting,
      driftScore: carState.driftScore,
      nitro: carState.nitro,
    });
  });

  return (
    <group ref={carGroup} position={[0, 0.4, -40]}>
      {/* Aerodynamic Chassis Lower Body */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.5, 4.2]} />
        <meshStandardMaterial
          color="#0f172a"
          metalness={0.9}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Cyber Carbon Fiber Side Skirts */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.05, 0.15, 3.8]} />
        <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.4} />
      </mesh>

      {/* Cockpit Canopy / Windshield */}
      <mesh position={[0, 0.85, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.45, 2.0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00b4d8"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Rear Cyber Wing Spoiler */}
      <group position={[0, 0.9, -1.8]}>
        <mesh position={[-0.7, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0.7, 0.1, 0]}>
          <boxGeometry args={[0.08, 0.35, 0.15]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[2.0, 0.06, 0.4]} />
          <meshStandardMaterial color="#9d4edd" emissive="#9d4edd" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Twin Front LED Headlights */}
      <mesh position={[-0.7, 0.45, 2.05]}>
        <boxGeometry args={[0.35, 0.12, 0.05]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <mesh position={[0.7, 0.45, 2.05]}>
        <boxGeometry args={[0.35, 0.12, 0.05]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>
      <spotLight
        position={[0, 0.5, 2.1]}
        target-position={[0, 0, 15]}
        color="#00f0ff"
        intensity={2.5}
        angle={0.6}
        penumbra={0.5}
        distance={25}
      />

      {/* Twin Rear LED Taillights (intensifies when braking) */}
      <mesh position={[-0.7, 0.5, -2.1]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <meshBasicMaterial color={keys.brake || keys.backward ? '#ff0055' : '#ef4444'} />
      </mesh>
      <mesh position={[0.7, 0.5, -2.1]}>
        <boxGeometry args={[0.35, 0.1, 0.05]} />
        <meshBasicMaterial color={keys.brake || keys.backward ? '#ff0055' : '#ef4444'} />
      </mesh>

      {/* Cyber Underglow Light */}
      <pointLight position={[0, 0.1, 0]} color="#00f0ff" intensity={1.8} distance={3.5} />

      {/* 4 Rotating Cyber Wheels */}
      {/* Front Left */}
      <group position={[-1.02, 0.35, 1.2]} ref={frontLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.18, 0.24, 16]} />
          <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[1.02, 0.35, 1.2]} ref={frontRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.24, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.18, 0.24, 16]} />
          <meshBasicMaterial color="#00f0ff" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Back Left */}
      <group position={[-1.02, 0.35, -1.2]} ref={backLeftWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.28, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.18, 0.25, 16]} />
          <meshBasicMaterial color="#9d4edd" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Back Right */}
      <group position={[1.02, 0.35, -1.2]} ref={backRightWheel}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.28, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.18, 0.25, 16]} />
          <meshBasicMaterial color="#9d4edd" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
