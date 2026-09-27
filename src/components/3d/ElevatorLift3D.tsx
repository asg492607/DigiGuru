import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../utils/audio';

interface ElevatorLift3DProps {
  position: [number, number, number];
  floorsCount: number;
  currentFloor: number;
  onChangeFloor: (floor: number) => void;
  playerPos?: [number, number, number];
  floorNames?: string[];
}

export const ElevatorLift3D: React.FC<ElevatorLift3DProps> = ({
  position,
  floorsCount,
  currentFloor,
  onChangeFloor,
  playerPos = [0, 0, 0],
  floorNames: _floorNames = [],
}) => {
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const doorProgress = useRef(0); // 0 = closed, 1 = open

  // Proximity to lift doors
  const dist = Math.hypot(playerPos[0] - position[0], playerPos[2] - position[2]);
  const isNearby = dist < 4.2;

  // Open doors when player approaches, unless moving between floors
  useEffect(() => {
    if (isTransitioning) return;
    if (isNearby) {
      if (!doorOpen) {
        soundManager.playDoorSlide();
        setDoorOpen(true);
      }
    } else {
      if (doorOpen) {
        soundManager.playDoorSlide();
        setDoorOpen(false);
      }
    }
  }, [isNearby, isTransitioning, doorOpen]);

  useFrame((_, delta) => {
    const target = doorOpen ? 1 : 0;
    doorProgress.current = THREE.MathUtils.lerp(doorProgress.current, target, delta * 6);

    const doorSlideDist = 0.95;
    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = -0.5 - doorProgress.current * doorSlideDist;
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = 0.5 + doorProgress.current * doorSlideDist;
    }
  });

  const handleSelectFloor = (targetFloor: number) => {
    if (targetFloor === currentFloor || isTransitioning) return;

    soundManager.playClick();
    setIsTransitioning(true);
    setDoorOpen(false); // Close doors

    // Elevator travel sequence
    setTimeout(() => {
      soundManager.playDoorSlide();
      onChangeFloor(targetFloor);
    }, 700);

    setTimeout(() => {
      soundManager.playElevatorDing();
      setIsTransitioning(false);
      setDoorOpen(true); // Open on arrival
    }, 1400);
  };

  return (
    <group position={position}>
      {/* Outer Elevator Shaft Surround / Architrave */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 4.8, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Recessed Door Frame Trim */}
      <mesh position={[0, 2.0, 0.12]}>
        <boxGeometry args={[2.4, 4.0, 0.15]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Digital Floor Indicator Display Header above door */}
      <group position={[0, 4.15, 0.22]}>
        <mesh>
          <boxGeometry args={[2.0, 0.6, 0.08]} />
          <meshStandardMaterial color="#020617" roughness={0.2} />
        </mesh>
        {/* Glowing Matrix Screen */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.85, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={isTransitioning ? 2.5 : 1.2}
          />
        </mesh>
      </group>

      {/* Stainless Steel Sliding Doors */}
      <group position={[0, 1.85, 0.05]}>
        {/* Left Sliding Door */}
        <mesh ref={leftDoorRef} position={[-0.5, 0, 0]} castShadow>
          <boxGeometry args={[1.05, 3.7, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Right Sliding Door */}
        <mesh ref={rightDoorRef} position={[0.5, 0, 0]} castShadow>
          <boxGeometry args={[1.05, 3.7, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Interior Elevator Cabin (Visible when doors slide open) */}
      <group position={[0, 1.85, -1.2]}>
        {/* Cabin Floor */}
        <mesh position={[0, -1.84, 0]} receiveShadow>
          <boxGeometry args={[2.2, 0.05, 2.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </mesh>
        {/* Cabin Ceiling with Recessed Light */}
        <mesh position={[0, 1.84, 0]}>
          <boxGeometry args={[2.2, 0.05, 2.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <pointLight position={[0, 1.6, 0]} intensity={1.5} distance={4} color="#f0f9ff" />

        {/* Back Mirror Wall */}
        <mesh position={[0, 0, -1.05]}>
          <boxGeometry args={[2.1, 3.6, 0.04]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.05} />
        </mesh>
        {/* Left Wall */}
        <mesh position={[-1.05, 0, 0]}>
          <boxGeometry args={[0.04, 3.6, 2.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Right Wall */}
        <mesh position={[1.05, 0, 0]}>
          <boxGeometry args={[0.04, 3.6, 2.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Interior Handrail */}
        <mesh position={[0, -0.4, -0.95]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.9, 12]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} />
        </mesh>
      </group>

      {/* Interactive In-World Lift Call / Floor Select Panel on Outer Wall */}
      <group position={[1.85, 2.0, 0.22]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 1.6, 0.08]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Floor Buttons Array */}
        {Array.from({ length: Math.min(floorsCount, 6) }).map((_, fIdx) => {
          const isSelected = fIdx === currentFloor;
          const yOff = 0.5 - fIdx * 0.26;

          return (
            <group
              key={`lift-btn-${fIdx}`}
              position={[0, yOff, 0.05]}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectFloor(fIdx);
              }}
            >
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
                <meshStandardMaterial
                  color={isSelected ? '#38bdf8' : '#64748b'}
                  emissive={isSelected ? '#0284c7' : '#000000'}
                  emissiveIntensity={isSelected ? 1.5 : 0}
                  metalness={0.7}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Proximity Walk-in Floor Travel Trigger Zone */}
      <mesh
        position={[0, 0.04, 0.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[2.5, 2.0]} />
      </mesh>

      {/* In-World Floating Prompt when nearby */}
      {isNearby && (
        <group position={[0, 0.02, 1.8]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.2}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
