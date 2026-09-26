import React, { useMemo } from 'react';
import * as THREE from 'three';

// Waypoints defining the main circuit loop connecting all 5 stations
export const TRACK_WAYPOINTS = [
  new THREE.Vector3(0, 0, -50),      // Station 1: About Me
  new THREE.Vector3(40, 0, -40),
  new THREE.Vector3(80, 0, 0),
  new THREE.Vector3(100, 0, 50),     // Station 2: Project Highway
  new THREE.Vector3(70, 0, 90),
  new THREE.Vector3(0, 0, 100),
  new THREE.Vector3(-50, 0, 95),
  new THREE.Vector3(-80, 0, 80),     // Station 3: Skills Arena
  new THREE.Vector3(-110, 0, 30),
  new THREE.Vector3(-120, 0, -60),   // Station 4: Web3 Oasis & Garage
  new THREE.Vector3(-80, 0, -100),
  new THREE.Vector3(0, 0, -120),
  new THREE.Vector3(50, 0, -120),    // Station 5: Contact Base
  new THREE.Vector3(25, 0, -80),
];

export function Track() {
  // Generate closed track curve
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(TRACK_WAYPOINTS, true, 'centripetal', 0.5);
  }, []);

  // Road geometry created via tube along the curve
  const { roadGeo, curbLeftGeo, curbRightGeo } = useMemo(() => {
    const points = curve.getSpacedPoints(200);
    
    // Create road ribbon
    const roadVertices = [];
    const roadIndices = [];
    const curbLeftPoints = [];
    const curbRightPoints = [];
    const ROAD_WIDTH = 12;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const nextP = points[(i + 1) % points.length];
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const pLeft = p.clone().add(normal.clone().multiplyScalar(ROAD_WIDTH / 2));
      const pRight = p.clone().add(normal.clone().multiplyScalar(-ROAD_WIDTH / 2));

      roadVertices.push(pLeft.x, 0.05, pLeft.z);
      roadVertices.push(pRight.x, 0.05, pRight.z);

      curbLeftPoints.push(new THREE.Vector3(pLeft.x, 0.25, pLeft.z));
      curbRightPoints.push(new THREE.Vector3(pRight.x, 0.25, pRight.z));

      if (i < points.length - 1) {
        const i0 = i * 2;
        const i1 = i * 2 + 1;
        const i2 = (i + 1) * 2;
        const i3 = (i + 1) * 2 + 1;

        roadIndices.push(i0, i1, i2);
        roadIndices.push(i1, i3, i2);
      }
    }

    // Connect the last segment back to the first segment
    const lastI = points.length - 1;
    roadIndices.push(lastI * 2, lastI * 2 + 1, 0);
    roadIndices.push(lastI * 2 + 1, 1, 0);

    // Close the curb line loops
    if (curbLeftPoints.length > 0) curbLeftPoints.push(curbLeftPoints[0].clone());
    if (curbRightPoints.length > 0) curbRightPoints.push(curbRightPoints[0].clone());

    const road = new THREE.BufferGeometry();
    road.setAttribute('position', new THREE.Float32BufferAttribute(roadVertices, 3));
    road.setIndex(roadIndices);
    road.computeVertexNormals();

    const curbLeft = new THREE.BufferGeometry().setFromPoints(curbLeftPoints);
    const curbRight = new THREE.BufferGeometry().setFromPoints(curbRightPoints);

    return { roadGeo: road, curbLeftGeo: curbLeft, curbRightGeo: curbRight };
  }, [curve]);

  // Cyber city background towers
  const towers = useMemo(() => {
    const list = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const radius = 170 + Math.random() * 80;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const height = 30 + Math.random() * 70;
      const width = 8 + Math.random() * 12;
      const color = i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#9d4edd' : '#ffd166';
      list.push({ x, z, height, width, color });
    }
    return list;
  }, []);

  return (
    <group>
      {/* Circuit Tarmac Mesh */}
      <mesh geometry={roadGeo} receiveShadow>
        <meshStandardMaterial color="#0a0f1d" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Glowing Neon Curbs (Left: Cyan, Right: Purple) */}
      <line geometry={curbLeftGeo}>
        <lineBasicMaterial color="#00f0ff" linewidth={3} />
      </line>
      <line geometry={curbRightGeo}>
        <lineBasicMaterial color="#9d4edd" linewidth={3} />
      </line>

      {/* Cyberpunk City Skyline Towers */}
      {towers.map((tower, idx) => (
        <group key={idx} position={[tower.x, tower.height / 2, tower.z]}>
          <mesh castShadow>
            <boxGeometry args={[tower.width, tower.height, tower.width]} />
            <meshStandardMaterial color="#060b19" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Tower Beacon Strip */}
          <mesh position={[0, 0, tower.width / 2 + 0.1]}>
            <planeGeometry args={[tower.width * 0.2, tower.height * 0.9]} />
            <meshBasicMaterial color={tower.color} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}

      {/* Futuristic Cyber Trees along the infield */}
      {[
        [-20, 0, -20], [-40, 0, 20], [20, 0, 40], [40, 0, -80],
        [-30, 0, -90], [30, 0, 10], [-60, 0, -20], [10, 0, -10]
      ].map((pos, idx) => (
        <group key={`tree-${idx}`} position={pos}>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.2, 0.4, 4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 4.5, 0]}>
            <coneGeometry args={[2.2, 4, 8]} />
            <meshStandardMaterial color="#0f766e" emissive="#14b8a6" emissiveIntensity={0.3} wireframe />
          </mesh>
        </group>
      ))}
    </group>
  );
}
