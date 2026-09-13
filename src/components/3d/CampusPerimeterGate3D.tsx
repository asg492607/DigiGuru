import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../utils/audio';

interface CampusPerimeterGate3DProps {
  playerPos: [number, number, number];
}

export const CampusPerimeterGate3D: React.FC<CampusPerimeterGate3DProps> = ({ playerPos }) => {
  const leftGateRef = useRef<THREE.Group>(null);
  const rightGateRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);
  const playedAudioRef = useRef(false);

  // Smooth gate position interpolation in useFrame
  useFrame((_, delta) => {
    // Distance from player to the main gate entrance at [0, 0, 48]
    const dist = Math.hypot(playerPos[0] - 0, playerPos[2] - 48);
    const shouldOpen = dist < 8.5;

    if (shouldOpen !== isOpen) {
      setIsOpen(shouldOpen);
      if (shouldOpen && !playedAudioRef.current) {
        soundManager.playClick();
        playedAudioRef.current = true;
      } else if (!shouldOpen) {
        playedAudioRef.current = false;
      }
    }

    const targetLeftX = shouldOpen ? -4.2 : -1.8;
    const targetRightX = shouldOpen ? 4.2 : 1.8;

    if (leftGateRef.current) {
      leftGateRef.current.position.x = THREE.MathUtils.damp(
        leftGateRef.current.position.x,
        targetLeftX,
        5,
        delta
      );
    }
    if (rightGateRef.current) {
      rightGateRef.current.position.x = THREE.MathUtils.damp(
        rightGateRef.current.position.x,
        targetRightX,
        5,
        delta
      );
    }
  });

  return (
    <group position={[0, 0, 48]}>
      {/* ============================================================== */}
      {/* GRAND ENTRANCE PYLONS & ARCHITRAVE */}
      {/* ============================================================== */}
      {/* Left Stone Pylon */}
      <mesh position={[-5.8, 4.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 9.0, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      {/* Right Stone Pylon */}
      <mesh position={[5.8, 4.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 9.0, 2.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      {/* Top Architectural Arch Beam */}
      <mesh position={[0, 9.2, 0]} castShadow>
        <boxGeometry args={[14.2, 1.8, 2.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Prominent High-Contrast Illuminated DigiGuru School Crest Banner */}
      <mesh position={[0, 10.4, 0.2]}>
        <boxGeometry args={[12.2, 1.4, 0.25]} />
        <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.8} />
      </mesh>

      {/* Security Status LED Indicator (Turns Green when Open, Red when Closed) */}
      <mesh position={[0, 8.2, 1.25]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={isOpen ? '#22c55e' : '#ef4444'}
          emissive={isOpen ? '#16a34a' : '#dc2626'}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Flagpoles */}
      <mesh position={[-7.8, 6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 12, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[-7.0, 11, 0]}>
        <planeGeometry args={[1.8, 1.0]} />
        <meshStandardMaterial color="#ea580c" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[7.8, 6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 12, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[8.6, 11, 0]}>
        <planeGeometry args={[1.8, 1.0]} />
        <meshStandardMaterial color="#10b981" side={THREE.DoubleSide} />
      </mesh>

      {/* ============================================================== */}
      {/* PHYSICAL AUTOMATED WROUGHT-IRON SLIDING GATES */}
      {/* ============================================================== */}
      {/* Left Gate Leaf (Slides Left) */}
      <group ref={leftGateRef} position={[-1.8, 2.0, 0]}>
        {/* Gate Outer Frame */}
        <mesh castShadow>
          <boxGeometry args={[3.6, 3.8, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Wrought Iron Vertical Bars */}
        {[-1.4, -1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((bx, i) => (
          <mesh key={`lbar-${i}`} position={[bx, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 3.7, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Gold School Emblem Shield on Gate */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[0.8, 0.8, 0.05]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Right Gate Leaf (Slides Right) */}
      <group ref={rightGateRef} position={[1.8, 2.0, 0]}>
        {/* Gate Outer Frame */}
        <mesh castShadow>
          <boxGeometry args={[3.6, 3.8, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Wrought Iron Vertical Bars */}
        {[-1.4, -1.0, -0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((bx, i) => (
          <mesh key={`rbar-${i}`} position={[bx, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 3.7, 8]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Gold School Emblem Shield on Gate */}
        <mesh position={[0, 0, 0.09]}>
          <boxGeometry args={[0.8, 0.8, 0.05]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ground Guide Tracks */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[11.5, 0.04, 0.35]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>

      {/* ============================================================== */}
      {/* SECURITY GUARD CHECKPOINT CABIN */}
      {/* ============================================================== */}
      <group position={[8.5, 0, 2]}>
        {/* Cabin Structure */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 4.4, 3.2]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Cabin Glass Window */}
        <mesh position={[-1.62, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.2, 1.4]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.7} metalness={0.8} />
        </mesh>
        {/* Overhanging Roof */}
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[3.8, 0.3, 3.8]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        {/* Security Officer Beacon Light */}
        <mesh position={[0, 4.8, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 0.35, 12]} />
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* PERIMETER BOUNDARY WALLS & RAILING (WEST & EAST OF GATE) */}
      {/* ============================================================== */}
      {/* West Boundary Wall */}
      <group position={[-25, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[36, 2.4, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* Wrought Iron Top Railing */}
        {Array.from({ length: 18 }).map((_, idx) => (
          <mesh key={`wrail-${idx}`} position={[-17 + idx * 2, 2.9, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* East Boundary Wall */}
      <group position={[28, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[36, 2.4, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.7} />
        </mesh>
        {/* Wrought Iron Top Railing */}
        {Array.from({ length: 18 }).map((_, idx) => (
          <mesh key={`erail-${idx}`} position={[-17 + idx * 2, 2.9, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.2, 6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
