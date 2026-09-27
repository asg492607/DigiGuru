import React from 'react';
import { soundManager } from '../../utils/audio';

interface StaircaseZone3DProps {
  position: [number, number, number];
  floorsCount: number;
  currentFloor: number;
  onChangeFloor: (floor: number) => void;
  playerPos?: [number, number, number];
}

export const StaircaseZone3D: React.FC<StaircaseZone3DProps> = ({
  position,
  floorsCount,
  currentFloor,
  onChangeFloor,
  playerPos = [0, 0, 0],
}) => {
  const canGoUp = currentFloor < floorsCount - 1;
  const canGoDown = currentFloor > 0;

  const handleStepUp = () => {
    if (!canGoUp) return;
    soundManager.playStairsStep();
    onChangeFloor(currentFloor + 1);
  };

  const handleStepDown = () => {
    if (!canGoDown) return;
    soundManager.playStairsStep();
    onChangeFloor(currentFloor - 1);
  };

  // Check proximity to stair base
  const dist = Math.hypot(playerPos[0] - position[0], playerPos[2] - position[2]);
  const isNearby = dist < 4.5;

  return (
    <group position={position}>
      {/* Stairwell Enclosure Wall Accent */}
      <mesh position={[0, 2.5, -2.6]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 5.0, 0.2]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>

      {/* Staircase Steps Geometry (8 Physical Steps ascending) */}
      {Array.from({ length: 8 }).map((_, stepIdx) => {
        const stepWidth = 2.4;
        const stepHeight = 0.24;
        const stepDepth = 0.35;
        const yPos = stepIdx * stepHeight + stepHeight / 2;
        const zPos = -stepIdx * stepDepth;

        return (
          <group key={`step-${stepIdx}`}>
            {/* Step Tread & Riser */}
            <mesh position={[0, yPos, zPos]} castShadow receiveShadow>
              <boxGeometry args={[stepWidth, stepHeight, stepDepth]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
            </mesh>
            {/* Dark Non-Slip Nose Strip */}
            <mesh position={[0, yPos + stepHeight / 2 + 0.005, zPos + stepDepth / 2 - 0.03]}>
              <boxGeometry args={[stepWidth - 0.1, 0.01, 0.05]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Intermediate Half Landing */}
      <mesh position={[0, 8 * 0.24, -8 * 0.35 - 0.6]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.24, 1.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>

      {/* Polished Stainless Steel Handrails & Balustrades */}
      {[-1.2, 1.2].map((xSide, i) => (
        <group key={`rail-${i}`} position={[xSide, 0, 0]}>
          {/* Vertical Baluster Posts */}
          {[0, 2, 4, 6, 8].map((sIdx) => (
            <mesh
              key={`post-${sIdx}`}
              position={[0, sIdx * 0.24 + 0.5, -sIdx * 0.35]}
              castShadow
            >
              <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {/* Angled Handrail Tube */}
          <mesh
            position={[0, 4 * 0.24 + 1.0, -4 * 0.35]}
            rotation={[0.55, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.04, 0.04, 3.6, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Up Stairs Interactive Floor Marker */}
      {canGoUp && (
        <group
          position={[0, 0.04, 1.2]}
          onClick={(e) => {
            e.stopPropagation();
            handleStepUp();
          }}
        >
          {/* Pulsing Floor Target Pad */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.9, 32]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#059669"
              emissiveIntensity={isNearby ? 1.4 : 0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Arrow Graphic Up */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 0.6, 3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Down Stairs Interactive Floor Marker */}
      {canGoDown && (
        <group
          position={[-1.6, 0.04, 0.2]}
          onClick={(e) => {
            e.stopPropagation();
            handleStepDown();
          }}
        >
          {/* Pulsing Floor Target Pad */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.75, 32]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#d97706"
              emissiveIntensity={isNearby ? 1.4 : 0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Arrow Graphic Down */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.35, 0.5, 3]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}

      {/* Staircase Signpost / Header */}
      <group position={[0, 3.8, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.55, 0.1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[2.2, 0.45, 0.02]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};
