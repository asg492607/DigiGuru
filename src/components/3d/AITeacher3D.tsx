import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TeacherState } from '../../types/campus';

interface AITeacher3DProps {
  position?: [number, number, number];
  isSpeaking?: boolean;
  gestureMode?: 'welcome' | 'point_board' | 'summon_ar' | 'celebrate';
  teacherModel?: 'human' | 'robot';
  teacherState?: TeacherState;
  onArrivalAtPodium?: () => void;
}

export const AITeacher3D: React.FC<AITeacher3DProps> = ({
  position = [-22, 0, -1],
  isSpeaking = false,
  gestureMode = 'welcome',
  teacherModel = 'human',
  teacherState = 'teaching',
  onArrivalAtPodium,
}) => {
  const teacherGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Articulated Arms
  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  // Articulated Legs for walking entrance
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Dynamic walk progress (0 = at south door [z=7.5], 1 = at front podium [z=-1])
  const walkProgressRef = useRef(teacherState === 'entering' ? 0 : 1);
  const hasArrivedRef = useRef(teacherState !== 'entering');

  // Bot refs
  const haloRef = useRef<THREE.Mesh>(null);
  const thrusterRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Reset walk progress if entering anew
    if (teacherState === 'entering' && hasArrivedRef.current) {
      walkProgressRef.current = 0;
      hasArrivedRef.current = false;
    } else if (teacherState === 'teaching' || teacherState === 'dismissed') {
      walkProgressRef.current = 1;
    }

    const isWalking = teacherState === 'entering' && walkProgressRef.current < 1;

    if (isWalking) {
      // Advance walk progress along classroom aisle
      walkProgressRef.current = Math.min(1, walkProgressRef.current + delta * 0.32);

      // Interpolate position from south door (z = 7.5) to podium (z = -1)
      const currentZ = THREE.MathUtils.lerp(7.5, position[2], walkProgressRef.current);
      if (teacherGroupRef.current) {
        teacherGroupRef.current.position.set(position[0], 0, currentZ);
        // Face forward towards board while walking, then rotate to face students
        if (walkProgressRef.current < 0.9) {
          teacherGroupRef.current.rotation.y = Math.PI; // walking north
        } else {
          const turnT = (walkProgressRef.current - 0.9) / 0.1;
          teacherGroupRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, turnT);
        }
      }

      // Leg swing animation
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = Math.sin(time * 8) * 0.45;
        rightLegRef.current.rotation.x = -Math.sin(time * 8) * 0.45;
      }

      // Arm swing during walk
      if (leftShoulderRef.current && rightShoulderRef.current) {
        leftShoulderRef.current.rotation.x = -Math.sin(time * 8) * 0.35;
        rightShoulderRef.current.rotation.x = Math.sin(time * 8) * 0.35;
      }

      // Check arrival at podium
      if (walkProgressRef.current >= 1 && !hasArrivedRef.current) {
        hasArrivedRef.current = true;
        if (onArrivalAtPodium) {
          onArrivalAtPodium();
        }
      }
    } else {
      // Standing at podium or desk
      if (teacherGroupRef.current) {
        teacherGroupRef.current.position.set(position[0], 0, position[2]);
        teacherGroupRef.current.rotation.y = 0; // face south towards students
        if (teacherModel === 'human') {
          teacherGroupRef.current.position.y = Math.sin(time * 1.5) * 0.015;
        } else {
          teacherGroupRef.current.position.y = 1.6 + Math.sin(time * 2) * 0.12;
        }
      }

      // Reset legs
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        rightLegRef.current.rotation.x = 0;
      }
    }

    // Head subtle tilt when speaking
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.8) * 0.15;
      headRef.current.rotation.x = Math.sin(time * 1.5) * 0.04;
    }

    // Eye blinking
    if (eyesRef.current) {
      const blink = Math.sin(time * 0.6) > 0.98 ? 0.1 : 1;
      eyesRef.current.scale.y = blink;
    }

    // Mouth animation when speaking
    if (mouthRef.current && isSpeaking) {
      const mouthScale = 1 + Math.abs(Math.sin(time * 12)) * 0.5;
      mouthRef.current.scale.set(mouthScale, mouthScale, 1);
    }

    // Bot halo
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 1.5;
    }
    if (thrusterRef.current) {
      const s = 1 + Math.sin(time * 8) * 0.15;
      thrusterRef.current.scale.set(s, s, s);
    }

    // Lifelike Arm & Hand Presentation Gestures
    if (leftShoulderRef.current && rightShoulderRef.current && leftForearmRef.current && rightForearmRef.current) {
      if (gestureMode === 'welcome') {
        // Right arm raised, hand waving warmly to children
        rightShoulderRef.current.rotation.z = -1.3;
        rightShoulderRef.current.rotation.x = -0.2;
        rightForearmRef.current.rotation.z = Math.sin(time * 5) * 0.35;

        leftShoulderRef.current.rotation.z = 0.2;
        leftShoulderRef.current.rotation.x = Math.sin(time * 1.5) * 0.1;
        leftForearmRef.current.rotation.x = -0.4;
      } else if (gestureMode === 'point_board') {
        // Right hand holding stylus points high and steady at the smartboard
        rightShoulderRef.current.rotation.z = -0.4;
        rightShoulderRef.current.rotation.x = -1.4;
        rightForearmRef.current.rotation.x = -0.2;

        leftShoulderRef.current.rotation.z = 0.3;
        leftShoulderRef.current.rotation.x = 0.2;
        leftForearmRef.current.rotation.x = -0.3;
      } else if (gestureMode === 'summon_ar') {
        // Both hands gesture downward towards AR stage
        rightShoulderRef.current.rotation.x = 0.8 + Math.sin(time * 3) * 0.08;
        rightShoulderRef.current.rotation.z = -0.4;
        rightForearmRef.current.rotation.x = -0.6;

        leftShoulderRef.current.rotation.x = 0.8 + Math.sin(time * 3) * 0.08;
        leftShoulderRef.current.rotation.z = 0.4;
        leftForearmRef.current.rotation.x = -0.6;
      } else if (gestureMode === 'celebrate') {
        // Both arms raised high in joy and applause
        rightShoulderRef.current.rotation.z = -2.2 - Math.sin(time * 8) * 0.15;
        rightForearmRef.current.rotation.z = -0.4;
        leftShoulderRef.current.rotation.z = 2.2 + Math.sin(time * 8) * 0.15;
        leftForearmRef.current.rotation.z = 0.4;
      }
    }
  });

  return (
    <group position={position}>
      <group ref={teacherGroupRef}>
        {teacherModel === 'human' ? (
          /* ========================================================== */
          /* LIFELIKE HUMANOID AI EDUCATOR ("MISS MAYA") */
          /* ========================================================== */
          <group>
            {/* HEAD & BEAUTIFUL DETAILED FACE */}
            <group ref={headRef} position={[0, 1.78, 0]}>
              {/* Sculpted Head */}
              <mesh castShadow>
                <sphereGeometry args={[0.2, 24, 24]} />
                <meshStandardMaterial color="#fde047" roughness={0.6} />
              </mesh>
              {/* Soft jawline & chin */}
              <mesh position={[0, -0.09, 0.03]} castShadow>
                <boxGeometry args={[0.16, 0.12, 0.16]} />
                <meshStandardMaterial color="#fde047" roughness={0.6} />
              </mesh>

              {/* Eyes (Animated Blinking) */}
              <group ref={eyesRef} position={[0, 0.02, 0.17]}>
                {/* Left Eye */}
                <group position={[-0.065, 0, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.035, 16, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                  </mesh>
                  <mesh position={[0, 0, 0.026]}>
                    <circleGeometry args={[0.02, 16]} />
                    <meshStandardMaterial color="#78350f" roughness={0.2} />
                  </mesh>
                  {/* Catchlight */}
                  <mesh position={[0.007, 0.007, 0.028]}>
                    <circleGeometry args={[0.006, 8]} />
                    <meshStandardMaterial color="#ffffff" />
                  </mesh>
                </group>

                {/* Right Eye */}
                <group position={[0.065, 0, 0]}>
                  <mesh>
                    <sphereGeometry args={[0.035, 16, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                  </mesh>
                  <mesh position={[0, 0, 0.026]}>
                    <circleGeometry args={[0.02, 16]} />
                    <meshStandardMaterial color="#78350f" roughness={0.2} />
                  </mesh>
                  <mesh position={[0.007, 0.007, 0.028]}>
                    <circleGeometry args={[0.006, 8]} />
                    <meshStandardMaterial color="#ffffff" />
                  </mesh>
                </group>
              </group>

              {/* Eyebrows */}
              <mesh position={[-0.065, 0.075, 0.18]} rotation={[0, 0, 0.08]}>
                <boxGeometry args={[0.055, 0.01, 0.02]} />
                <meshStandardMaterial color="#292524" />
              </mesh>
              <mesh position={[0.065, 0.075, 0.18]} rotation={[0, 0, -0.08]}>
                <boxGeometry args={[0.055, 0.01, 0.02]} />
                <meshStandardMaterial color="#292524" />
              </mesh>

              {/* Realistic Smart Glasses */}
              <group position={[0, 0.02, 0.18]}>
                {/* Frame */}
                <mesh position={[-0.065, 0, 0]}>
                  <ringGeometry args={[0.04, 0.048, 20]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0.065, 0, 0]}>
                  <ringGeometry args={[0.04, 0.048, 20]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.04, 0.008, 0.01]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.8} />
                </mesh>
              </group>

              {/* Gentle Smiling Mouth */}
              <mesh ref={mouthRef} position={[0, -0.08, 0.18]} rotation={[0, 0, Math.PI]}>
                <ringGeometry args={[0.035, 0.048, 16, 1, 0, Math.PI]} />
                <meshStandardMaterial color="#e11d48" side={THREE.DoubleSide} />
              </mesh>

              {/* Professional Hairstyle */}
              <group position={[0, 0.06, -0.02]}>
                <mesh position={[0, 0.08, 0]} castShadow>
                  <sphereGeometry args={[0.22, 24, 24]} />
                  <meshStandardMaterial color="#262626" roughness={0.8} />
                </mesh>
                {/* Bun / Chignon in back */}
                <mesh position={[0, 0.05, -0.18]} castShadow>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#171717" roughness={0.8} />
                </mesh>
                {/* Hair clip */}
                <mesh position={[0, 0.05, -0.22]}>
                  <boxGeometry args={[0.1, 0.03, 0.02]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
                </mesh>
              </group>
            </group>

            {/* TORSO & CHIC EDUCATOR ATTIRE */}
            <group position={[0, 1.25, 0]}>
              {/* Neck */}
              <mesh position={[0, 0.38, 0]} castShadow>
                <cylinderGeometry args={[0.065, 0.075, 0.16, 16]} />
                <meshStandardMaterial color="#fde047" roughness={0.6} />
              </mesh>

              {/* Silk Blouse */}
              <mesh position={[0, 0.28, 0.04]} castShadow>
                <boxGeometry args={[0.26, 0.18, 0.18]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>

              {/* Tailored Navy Blazer */}
              <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.42, 0.58, 0.24]} />
                <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
              </mesh>

              {/* Ivory Lapels */}
              <mesh position={[-0.11, 0.22, 0.13]} rotation={[0, 0, -0.15]}>
                <boxGeometry args={[0.07, 0.28, 0.02]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>
              <mesh position={[0.11, 0.22, 0.13]} rotation={[0, 0, 0.15]}>
                <boxGeometry args={[0.07, 0.28, 0.02]} />
                <meshStandardMaterial color="#f1f5f9" />
              </mesh>

              {/* Golden DigiGuru Educator Badge */}
              <mesh position={[-0.12, 0.18, 0.14]}>
                <circleGeometry args={[0.035, 16]} />
                <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={1} metalness={0.9} />
              </mesh>
            </group>

            {/* ARTICULATED ARMS & HANDS WITH DIGITAL STYLUS */}
            {/* Left Arm */}
            <group ref={leftShoulderRef} position={[-0.26, 1.48, 0]}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <cylinderGeometry args={[0.065, 0.055, 0.32, 12]} />
                <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
              </mesh>
              <group ref={leftForearmRef} position={[0, -0.3, 0]}>
                <mesh position={[0, -0.12, 0]} castShadow>
                  <cylinderGeometry args={[0.055, 0.045, 0.26, 12]} />
                  <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.28, 0]} castShadow>
                  <sphereGeometry args={[0.042, 12, 12]} />
                  <meshStandardMaterial color="#fde047" roughness={0.6} />
                </mesh>
              </group>
            </group>

            {/* Right Arm (holding digital stylus) */}
            <group ref={rightShoulderRef} position={[0.26, 1.48, 0]}>
              <mesh position={[0, -0.15, 0]} castShadow>
                <cylinderGeometry args={[0.065, 0.055, 0.32, 12]} />
                <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
              </mesh>
              <group ref={rightForearmRef} position={[0, -0.3, 0]}>
                <mesh position={[0, -0.12, 0]} castShadow>
                  <cylinderGeometry args={[0.055, 0.045, 0.26, 12]} />
                  <meshStandardMaterial color="#1e1b4b" roughness={0.4} />
                </mesh>
                <mesh position={[0, -0.28, 0]} castShadow>
                  <sphereGeometry args={[0.042, 12, 12]} />
                  <meshStandardMaterial color="#fde047" roughness={0.6} />
                </mesh>
                {/* Glowing Digital Stylus Pointer */}
                <mesh position={[0, -0.36, 0.12]} rotation={[0.4, 0, 0]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.35, 8]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
                </mesh>
              </group>
            </group>

            {/* TAILORED DRESS TROUSERS & ELEGANT SHOES WITH HIP ARTICULATION */}
            <group position={[0, 0.8, 0]}>
              {/* Left Leg from Hip */}
              <group ref={leftLegRef} position={[-0.1, 0, 0]}>
                <mesh position={[0, -0.38, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.07, 0.8, 12]} />
                  <meshStandardMaterial color="#334155" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.78, 0.04]} castShadow>
                  <boxGeometry args={[0.11, 0.06, 0.22]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
                </mesh>
              </group>

              {/* Right Leg from Hip */}
              <group ref={rightLegRef} position={[0.1, 0, 0]}>
                <mesh position={[0, -0.38, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.07, 0.8, 12]} />
                  <meshStandardMaterial color="#334155" roughness={0.5} />
                </mesh>
                <mesh position={[0, -0.78, 0.04]} castShadow>
                  <boxGeometry args={[0.11, 0.06, 0.22]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
                </mesh>
              </group>
            </group>
          </group>
        ) : (
          /* ========================================================== */
          /* COMPANION ROBOT GURU-BOT MODE */
          /* ========================================================== */
          <group>
            {/* Floating Halo Indicator */}
            <mesh ref={haloRef} position={[0, 1.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.45, 0.04, 16, 32]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={isSpeaking ? 2.5 : 1.2}
              />
            </mesh>

            {/* Robot Head */}
            <group ref={headRef} position={[0, 1.1, 0]}>
              <mesh castShadow>
                <sphereGeometry args={[0.55, 24, 24]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.05, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <sphereGeometry args={[0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.8} roughness={0.1} />
              </mesh>
              <mesh position={[-0.14, 0.1, 0.53]}>
                <circleGeometry args={[0.06, 16]} />
                <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2} />
              </mesh>
              <mesh position={[0.14, 0.1, 0.53]}>
                <circleGeometry args={[0.06, 16]} />
                <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={2} />
              </mesh>
            </group>

            {/* Torso */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <cylinderGeometry args={[0.42, 0.32, 0.9, 20]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.6} />
            </mesh>

            {/* Thruster */}
            <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.3, 0.45, 16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
            <mesh ref={thrusterRef} position={[0, -0.6, 0]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2.5} transparent opacity={0.8} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
