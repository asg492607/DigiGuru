import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProximitySlidingDoor3DProps {
  position: [number, number, number];
  rotationY?: number;
  playerPos: [number, number, number];
  doorWidth?: number;
  doorHeight?: number;
  triggerDistance?: number;
  frameColor?: string;
}

export const ProximitySlidingDoor3D: React.FC<ProximitySlidingDoor3DProps> = ({
  position,
  rotationY = 0,
  playerPos,
  doorWidth = 3.2,
  doorHeight = 3.2,
  triggerDistance = 5.5,
  frameColor = '#0f172a',
}) => {
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);

  const panelWidth = doorWidth * 0.48;
  const halfPanel = panelWidth / 2;

  useFrame((_, delta) => {
    // Calculate 2D distance on the ground plane (X, Z)
    const dist = Math.hypot(playerPos[0] - position[0], playerPos[2] - position[2]);
    const isOpen = dist < triggerDistance;

    // When open, slide each panel outward
    const slideOffset = isOpen ? panelWidth * 0.92 : 0;

    const targetLeftX = -halfPanel - slideOffset;
    const targetRightX = halfPanel + slideOffset;

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeftX,
        6,
        delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRightX,
        6,
        delta
      );
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Outer Door Frame Structure */}
      {/* Top Header */}
      <mesh position={[0, doorHeight + 0.1, 0]} castShadow>
        <boxGeometry args={[doorWidth + 0.4, 0.25, 0.3]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Left Frame Jam */}
      <mesh position={[-doorWidth / 2 - 0.1, doorHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.2, doorHeight, 0.3]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Right Frame Jam */}
      <mesh position={[doorWidth / 2 + 0.1, doorHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.2, doorHeight, 0.3]} />
        <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Ground Threshold */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[doorWidth + 0.4, 0.1, 0.35]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>

      {/* Interior Doorway Hole Void (Dark glass backing) */}
      <mesh position={[0, doorHeight / 2, -0.05]}>
        <planeGeometry args={[doorWidth, doorHeight]} />
        <meshStandardMaterial color="#020617" roughness={0.1} />
      </mesh>

      {/* Left Sliding Glass Door Leaf */}
      <group ref={leftDoorRef} position={[-halfPanel, doorHeight / 2, 0.02]}>
        {/* Glass Panel */}
        <mesh castShadow>
          <boxGeometry args={[panelWidth, doorHeight * 0.96, 0.06]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Aluminum Door Frame Perimeter */}
        <mesh>
          <boxGeometry args={[panelWidth, 0.1, 0.08]} />
          <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
        {/* Vertical Door Handle */}
        <mesh position={[panelWidth / 2 - 0.1, 0, 0.06]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>

      {/* Right Sliding Glass Door Leaf */}
      <group ref={rightDoorRef} position={[halfPanel, doorHeight / 2, 0.02]}>
        {/* Glass Panel */}
        <mesh castShadow>
          <boxGeometry args={[panelWidth, doorHeight * 0.96, 0.06]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {/* Aluminum Door Frame Perimeter */}
        <mesh>
          <boxGeometry args={[panelWidth, 0.1, 0.08]} />
          <meshStandardMaterial color={frameColor} metalness={0.9} />
        </mesh>
        {/* Vertical Door Handle */}
        <mesh position={[-panelWidth / 2 + 0.1, 0, 0.06]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
      </group>
    </group>
  );
};
