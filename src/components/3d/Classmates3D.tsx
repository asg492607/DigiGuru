import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Classmate } from '../../types/campus';

interface Classmates3DProps {
  classmates: Classmate[];
  isInsideNursery: boolean;
  onSelectClassmate?: (classmate: Classmate) => void;
}

export const Classmates3D: React.FC<Classmates3DProps> = ({
  classmates,
  isInsideNursery,
  onSelectClassmate,
}) => {
  const groupsRef = useRef<{ [key: string]: THREE.Group | null }>({});
  const handsRef = useRef<{ [key: string]: THREE.Group | null }>({});
  const eyesRef = useRef<{ [key: string]: THREE.Group | null }>({});

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    classmates.forEach((c) => {
      const group = groupsRef.current[c.id];
      const hand = handsRef.current[c.id];
      const eye = eyesRef.current[c.id];
      const idNum = parseInt(c.id.slice(-1)) || 1;

      if (group) {
        if (isInsideNursery && c.currentZone === 'bldg_nursery') {
          // Natural sitting breath / attentive listening
          group.position.y = 0.45 + Math.sin(time * 2 + idNum) * 0.015;
        } else {
          // Standing breath & subtle weight shift
          group.position.y = Math.sin(time * 2 + idNum) * 0.02;
        }
      }

      // Eye blinking
      if (eye) {
        const blink = Math.sin(time * 0.7 + idNum) > 0.97 ? 0.1 : 1;
        eye.scale.y = blink;
      }

      // Raising hand in class
      if (hand && c.isRaisingHand) {
        hand.rotation.z = -1.6 + Math.sin(time * 6) * 0.25;
        hand.rotation.x = -0.4;
      }
    });
  });

  return (
    <group>
      {classmates.map((c) => {
        const isRendered = isInsideNursery
          ? c.currentZone === 'bldg_nursery'
          : c.currentZone !== 'bldg_nursery';

        if (!isRendered) return null;

        const pos = isInsideNursery && c.currentZone === 'bldg_nursery'
          ? [c.position[0], 0.35, c.position[2]] as [number, number, number]
          : c.position;

        const isSitting = isInsideNursery && c.currentZone === 'bldg_nursery';
        const isGirl = c.name.includes('Maya') || c.name.includes('Priya');

        return (
          <group
            key={c.id}
            position={pos}
            ref={(el) => { groupsRef.current[c.id] = el; }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectClassmate?.(c);
            }}
          >
            {/* ======================================================== */}
            {/* REALISTIC HUMANOID HEAD & FACIAL FEATURES */}
            {/* ======================================================== */}
            <group position={[0, isSitting ? 1.05 : 1.35, 0]}>
              {/* Sculpted Head */}
              <mesh castShadow>
                <sphereGeometry args={[0.18, 20, 20]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.6} />
              </mesh>
              {/* Chin */}
              <mesh position={[0, -0.07, 0.03]} castShadow>
                <boxGeometry args={[0.14, 0.1, 0.14]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.6} />
              </mesh>

              {/* Eyes with pupils & blinking */}
              <group
                ref={(el) => { eyesRef.current[c.id] = el; }}
                position={[0, 0.015, 0.15]}
              >
                <mesh position={[-0.055, 0, 0]}>
                  <sphereGeometry args={[0.028, 12, 12]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </mesh>
                <mesh position={[-0.055, 0, 0.022]}>
                  <circleGeometry args={[0.016, 12]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>

                <mesh position={[0.055, 0, 0]}>
                  <sphereGeometry args={[0.028, 12, 12]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </mesh>
                <mesh position={[0.055, 0, 0.022]}>
                  <circleGeometry args={[0.016, 12]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>

              {/* Smile */}
              <mesh position={[0, -0.065, 0.16]} rotation={[0, 0, Math.PI]}>
                <ringGeometry args={[0.025, 0.038, 12, 1, 0, Math.PI]} />
                <meshStandardMaterial color="#be123c" side={THREE.DoubleSide} />
              </mesh>

              {/* INDIVIDUAL REALISTIC HAIRSTYLES */}
              {isGirl ? (
                /* Ponytail / Braids */
                <group position={[0, 0.06, -0.02]}>
                  <mesh position={[0, 0.06, 0]} castShadow>
                    <sphereGeometry args={[0.19, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
                    <meshStandardMaterial color={c.hairColor} roughness={0.8} />
                  </mesh>
                  {/* High Ponytail */}
                  <mesh position={[0, 0.12, -0.16]} rotation={[0.4, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.06, 0.04, 0.22, 12]} />
                    <meshStandardMaterial color={c.hairColor} roughness={0.8} />
                  </mesh>
                  {/* Colorful hair ribbon */}
                  <mesh position={[0, 0.14, -0.14]}>
                    <torusGeometry args={[0.05, 0.015, 8, 16]} />
                    <meshStandardMaterial color="#ec4899" />
                  </mesh>
                </group>
              ) : (
                /* Textured Boys Short Cut */
                <group position={[0, 0.06, -0.02]}>
                  <mesh position={[0, 0.06, 0]} castShadow>
                    <sphereGeometry args={[0.19, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
                    <meshStandardMaterial color={c.hairColor} roughness={0.8} />
                  </mesh>
                  {/* Side-swept bangs */}
                  <mesh position={[0, 0.1, 0.12]} rotation={[0.3, 0, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.06, 0.06]} />
                    <meshStandardMaterial color={c.hairColor} roughness={0.8} />
                  </mesh>
                </group>
              )}
            </group>

            {/* ======================================================== */}
            {/* TAILORED SCHOOL UNIFORM & CREST */}
            {/* ======================================================== */}
            <group position={[0, isSitting ? 0.65 : 0.95, 0]}>
              {/* Neck & Collar */}
              <mesh position={[0, 0.3, 0]} castShadow>
                <cylinderGeometry args={[0.065, 0.075, 0.1, 12]} />
                <meshStandardMaterial color="#fed7aa" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.26, 0.02]} castShadow>
                <cylinderGeometry args={[0.09, 0.11, 0.06, 12]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>

              {/* Tie */}
              <mesh position={[0, 0.14, 0.12]}>
                <boxGeometry args={[0.045, 0.2, 0.02]} />
                <meshStandardMaterial color="#f43f5e" />
              </mesh>

              {/* Tailored Blazer */}
              <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.36, 0.44, 0.22]} />
                <meshStandardMaterial color={c.avatarColor} roughness={0.5} />
              </mesh>

              {/* Lapels */}
              <mesh position={[-0.08, 0.16, 0.12]} rotation={[0, 0, -0.15]}>
                <boxGeometry args={[0.06, 0.2, 0.015]} />
                <meshStandardMaterial color={c.avatarColor} roughness={0.4} />
              </mesh>
              <mesh position={[0.08, 0.16, 0.12]} rotation={[0, 0, 0.15]}>
                <boxGeometry args={[0.06, 0.2, 0.015]} />
                <meshStandardMaterial color={c.avatarColor} roughness={0.4} />
              </mesh>

              {/* DigiGuru Crest */}
              <mesh position={[-0.1, 0.14, 0.12]}>
                <circleGeometry args={[0.025, 12]} />
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
              </mesh>

              {/* Backpack (when outdoors) */}
              {!isSitting && (
                <mesh position={[0, 0.06, -0.15]} castShadow>
                  <boxGeometry args={[0.26, 0.34, 0.14]} />
                  <meshStandardMaterial color="#334155" roughness={0.6} />
                </mesh>
              )}
            </group>

            {/* ======================================================== */}
            {/* ARMS (LEFT & RIGHT) */}
            {/* ======================================================== */}
            {/* Left Arm */}
            <group position={[-0.22, isSitting ? 0.85 : 1.15, 0]}>
              <mesh position={[0, -0.12, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.05, 0.26, 10]} />
                <meshStandardMaterial color={c.avatarColor} />
              </mesh>
              {/* Hand resting on knee or hanging */}
              <mesh position={[0, -0.28, isSitting ? 0.1 : 0]} castShadow>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial color="#fed7aa" />
              </mesh>
            </group>

            {/* Right Arm (Can raise hand) */}
            <group
              ref={(el) => { handsRef.current[c.id] = el; }}
              position={[0.22, isSitting ? 0.85 : 1.15, 0]}
            >
              <mesh position={[0, -0.12, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.05, 0.26, 10]} />
                <meshStandardMaterial color={c.avatarColor} />
              </mesh>
              <mesh position={[0, -0.28, isSitting && !c.isRaisingHand ? 0.1 : 0]} castShadow>
                <sphereGeometry args={[0.04, 10, 10]} />
                <meshStandardMaterial color="#fed7aa" />
              </mesh>
            </group>

            {/* ======================================================== */}
            {/* LOWER BODY: SEATED OR STANDING */}
            {/* ======================================================== */}
            {isSitting ? (
              /* Realistic Sitting Posture: Thighs forward, calves down */
              <group position={[0, 0.45, 0]}>
                {/* Bent Thighs */}
                <mesh position={[-0.09, 0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.07, 0.065, 0.32, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.09, 0.05, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.07, 0.065, 0.32, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                {/* Calves & Shoes */}
                <mesh position={[-0.09, -0.15, 0.3]} castShadow>
                  <cylinderGeometry args={[0.06, 0.055, 0.28, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.09, -0.15, 0.3]} castShadow>
                  <cylinderGeometry args={[0.06, 0.055, 0.28, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                {/* Shoes */}
                <mesh position={[-0.09, -0.28, 0.35]}>
                  <boxGeometry args={[0.1, 0.04, 0.18]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0.09, -0.28, 0.35]}>
                  <boxGeometry args={[0.1, 0.04, 0.18]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              </group>
            ) : (
              /* Standing Legs */
              <group position={[0, 0.5, 0]}>
                <mesh position={[-0.09, -0.18, 0]} castShadow>
                  <cylinderGeometry args={[0.075, 0.065, 0.54, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0.09, -0.18, 0]} castShadow>
                  <cylinderGeometry args={[0.075, 0.065, 0.54, 10]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[-0.09, -0.48, 0.04]} castShadow>
                  <boxGeometry args={[0.1, 0.05, 0.2]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0.09, -0.48, 0.04]} castShadow>
                  <boxGeometry args={[0.1, 0.05, 0.2]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              </group>
            )}

            {/* Hover Name Tag Indicator */}
            <mesh position={[0, isSitting ? 1.55 : 1.85, 0]}>
              <planeGeometry args={[1.2, 0.3]} />
              <meshStandardMaterial
                color="#0f172a"
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
