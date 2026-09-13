import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { LessonStep } from '../../types/campus';
import { getOakWoodTexture, getSmartBoardTexture } from '../../utils/proceduralTextures';
import { ProximitySlidingDoor3D } from './ProximitySlidingDoor3D';

interface NurseryClassroom3DProps {
  currentStep?: LessonStep;
  onExitToCampus: () => void;
  playerPos?: [number, number, number];
}

export const NurseryClassroom3D: React.FC<NurseryClassroom3DProps> = ({
  currentStep,
  onExitToCampus,
  playerPos = [-22, 0, 2],
}) => {
  const arHologramRef = useRef<THREE.Group>(null);
  const elephantEarsRef = useRef<THREE.Group>(null);
  const elephantTrunkRef = useRef<THREE.Group>(null);
  const elephantTailRef = useRef<THREE.Mesh>(null);
  const orbsGroupRef = useRef<THREE.Group>(null);
  const starClusterRef = useRef<THREE.Group>(null);
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);

  // Procedural textures
  const woodTex = useMemo(() => getOakWoodTexture(), []);
  const smartBoardTex = useMemo(() => getSmartBoardTexture(), []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Ceiling fans
    if (fanRef1.current) fanRef1.current.rotation.y += delta * 4.5;
    if (fanRef2.current) fanRef2.current.rotation.y += delta * 4.5;

    if (arHologramRef.current) {
      arHologramRef.current.rotation.y += delta * 0.4;
    }

    // Animate Elephant: ears flapping, trunk swaying, tail wagging
    if (elephantEarsRef.current) {
      elephantEarsRef.current.rotation.y = Math.sin(time * 3) * 0.22;
    }
    if (elephantTrunkRef.current) {
      elephantTrunkRef.current.rotation.x = -0.2 + Math.sin(time * 2.5) * 0.35;
      elephantTrunkRef.current.position.y = 1.6 + Math.sin(time * 2.5) * 0.12;
    }
    if (elephantTailRef.current) {
      elephantTailRef.current.rotation.z = Math.sin(time * 4) * 0.3;
    }

    // Animate Counting Orbs
    if (orbsGroupRef.current) {
      orbsGroupRef.current.rotation.y += delta * 0.6;
      orbsGroupRef.current.position.y = 1.3 + Math.sin(time * 2) * 0.18;
    }

    // Animate Star Cluster
    if (starClusterRef.current) {
      starClusterRef.current.rotation.y += delta * 0.8;
      starClusterRef.current.rotation.z = Math.sin(time) * 0.15;
    }
  });

  const arType = currentStep?.arObject || 'none';

  return (
    <group position={[-22, 0, 5]}>
      {/* ============================================================== */}
      {/* REALISTIC CLASSROOM PARQUET FLOORING & ARCHITECTURAL WALLS */}
      {/* ============================================================== */}
      {/* Polished Oak Parquet Wood Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial
          map={woodTex}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling with Recessed LED Lights */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* 6 Soft Recessed LED Ceiling Light Panels */}
      {[
        [-4, 6.95, -4], [4, 6.95, -4],
        [-4, 6.95, 0], [4, 6.95, 0],
        [-4, 6.95, 4], [4, 6.95, 4],
      ].map(([lx, ly, lz], idx) => (
        <mesh key={`led-${idx}`} position={[lx, ly, lz]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 1.2]} />
          <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={1.2} />
        </mesh>
      ))}

      {/* 2 Animated Ceiling Fans */}
      {[
        { id: 'f1', pos: [0, 6.4, -3], ref: fanRef1 },
        { id: 'f2', pos: [0, 6.4, 3], ref: fanRef2 },
      ].map((fan) => (
        <group key={fan.id} position={fan.pos as [number, number, number]}>
          {/* Fan Downrod */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Fan Motor */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Rotating Blades */}
          <group ref={fan.ref}>
            {[0, 1, 2, 3].map((b) => (
              <mesh key={`blade-${b}`} position={[Math.cos((b * Math.PI) / 2) * 0.9, 0, Math.sin((b * Math.PI) / 2) * 0.9]} rotation={[0, (b * Math.PI) / 2, 0]}>
                <boxGeometry args={[0.2, 0.02, 1.4]} />
                <meshStandardMaterial color="#78350f" />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* North Wall with Smartboard */}
      <mesh position={[0, 3.5, -8]} receiveShadow>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#f0fdf4" roughness={0.6} />
      </mesh>

      {/* South Wall with Doorway */}
      <mesh position={[0, 3.5, 8]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[18, 7]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.6} />
      </mesh>

      {/* Left Wall with Sunny Windows */}
      <mesh position={[-9, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#fce7f3" roughness={0.6} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[9, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.6} />
      </mesh>

      {/* Baseboards */}
      <mesh position={[0, 0.2, -7.95]}>
        <boxGeometry args={[18, 0.4, 0.1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Alphabet Banner on North Wall */}
      <mesh position={[0, 6.2, -7.94]}>
        <boxGeometry args={[16, 0.8, 0.05]} />
        <meshStandardMaterial color="#e11d48" />
      </mesh>

      {/* Analog Classroom Wall Clock */}
      <group position={[0, 6.3, -7.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.08, 24]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.48, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.5} />
        </mesh>
        {/* Clock Hands */}
        <mesh position={[0, 0.15, 0.06]}>
          <boxGeometry args={[0.04, 0.35, 0.01]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0.12, 0, 0.06]}>
          <boxGeometry args={[0.26, 0.03, 0.01]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Sunny Windows on Left Wall */}
      {[-4, 0, 4].map((z, i) => (
        <group key={`win-${i}`} position={[-8.95, 3.8, z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.8, 3.4, 0.15]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.5, 3.1]} />
            <meshStandardMaterial
              color="#bae6fd"
              emissive="#7dd3fc"
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* ============================================================== */}
      {/* TEACHER EXECUTIVE DESK & PODIUM */}
      {/* ============================================================== */}
      {/* Teacher Desk at Front-Right */}
      <group position={[5.2, 0, -5.5]}>
        {/* Oak Table Top */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[2.8, 0.1, 1.4]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        {/* Desk Legs */}
        {[-1.2, 1.2].map((lx, idx) => (
          <mesh key={`deskleg-${idx}`} position={[lx, 0.7, 0]} castShadow>
            <boxGeometry args={[0.1, 1.4, 1.2]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        ))}
        {/* Teacher Laptop */}
        <mesh position={[-0.4, 1.48, 0]} castShadow>
          <boxGeometry args={[0.6, 0.04, 0.45]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[-0.4, 1.7, -0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.6, 0.4, 0.03]} />
          <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>
        {/* Lesson Tablet & Notebooks */}
        <mesh position={[0.5, 1.48, 0.1]}>
          <boxGeometry args={[0.4, 0.04, 0.3]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <mesh position={[0.8, 1.55, -0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.22, 12]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
        {/* Teacher Swivel Chair */}
        <group position={[0, 0, -0.9]}>
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 1.35, -0.35]} castShadow>
            <boxGeometry args={[0.8, 0.9, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.85, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* Front Teacher Presentation Podium */}
      <group position={[0, 0, -2.4]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[1.2, 2.0, 0.7]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Golden DigiGuru School Logo on Podium */}
        <mesh position={[0, 1.2, 0.36]}>
          <circleGeometry args={[0.22, 16]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Podium Slanted Reading Desk */}
        <mesh position={[0, 2.05, 0]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[1.3, 0.08, 0.8]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Microphone */}
        <mesh position={[0.4, 2.25, -0.1]} rotation={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* STUDENT ACTIVITY STUDY TABLES & CHAIRS */}
      {/* ============================================================== */}
      {[
        [-5.0, 0, -1.2],
        [-5.0, 0, 3.2],
        [5.0, 0, -1.2],
        [5.0, 0, 3.2],
      ].map(([tx, ty, tz], idx) => (
        <group key={`stud-table-${idx}`} position={[tx, ty, tz]}>
          {/* Round Low Study Table */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[1.4, 1.4, 0.08, 24]} />
            <meshStandardMaterial color="#ffedd5" roughness={0.3} />
          </mesh>
          {/* Metal Leg Frame */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* Open Sketchbooks & Crayons on Table */}
          <mesh position={[-0.4, 0.96, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.4]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.4, 0.96, 0.2]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.5, 0.02, 0.4]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          {/* Pencil Caddy in center */}
          <mesh position={[0, 1.05, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.22, 12]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>

          {/* 3 Little Student Chairs around Table */}
          {[0, 1, 2].map((ci) => {
            const cAngle = (ci * Math.PI * 2) / 3;
            const cx = Math.cos(cAngle) * 1.9;
            const cz = Math.sin(cAngle) * 1.9;
            return (
              <group key={`chair-${ci}`} position={[cx, 0, cz]} rotation={[0, -cAngle + Math.PI / 2, 0]}>
                <mesh position={[0, 0.5, 0]} castShadow>
                  <boxGeometry args={[0.6, 0.06, 0.6]} />
                  <meshStandardMaterial color={idx % 2 === 0 ? '#38bdf8' : '#ec4899'} />
                </mesh>
                <mesh position={[0, 0.85, -0.27]} castShadow>
                  <boxGeometry args={[0.6, 0.6, 0.05]} />
                  <meshStandardMaterial color={idx % 2 === 0 ? '#0284c7' : '#db2777'} />
                </mesh>
                <mesh position={[0, 0.25, 0]}>
                  <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                  <meshStandardMaterial color="#334155" metalness={0.8} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ============================================================== */}
      {/* STUDENT BACKPACK STORAGE CUBBIES (EAST WALL) */}
      {/* ============================================================== */}
      <group position={[8.7, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Main Cabinet Frame */}
        <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[8.0, 3.2, 0.9]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
        {/* Individual Colorful Cubby Compartments */}
        {[-2.8, -1.0, 1.0, 2.8].map((cx, i) => (
          <group key={`cubby-col-${i}`}>
            <mesh position={[cx, 1.0, 0.35]}>
              <boxGeometry args={[1.5, 1.2, 0.6]} />
              <meshStandardMaterial color={['#3b82f6', '#ec4899', '#10b981', '#f59e0b'][i]} />
            </mesh>
            <mesh position={[cx, 2.3, 0.35]}>
              <boxGeometry args={[1.5, 1.2, 0.6]} />
              <meshStandardMaterial color={['#8b5cf6', '#06b6d4', '#eab308', '#ef4444'][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ============================================================== */}
      {/* HIGH-TECH INTERACTIVE SMART BOARD WITH LIVE CANVAS TEXTURE */}
      {/* ============================================================== */}
      <group position={[0, 3.8, -7.85]}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[9.6, 4.6, 0.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Board Surface with Procedural Texture */}
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[9.2, 4.2]} />
          <meshStandardMaterial
            map={smartBoardTex}
            roughness={0.2}
          />
        </mesh>
        {/* High-tech Screen Glow Border */}
        <mesh position={[0, 0, 0.13]}>
          <ringGeometry args={[4.45, 4.55, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* RAINBOW CIRCLE TIME RUG ([0, 0.01, 1]) */}
      {/* ============================================================== */}
      <group position={[0, 0.01, 1]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.2, 48]} />
          <meshStandardMaterial color="#0284c7" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <ringGeometry args={[2.8, 3.6, 48]} />
          <meshStandardMaterial color="#ec4899" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <ringGeometry args={[1.5, 2.3, 48]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshStandardMaterial color="#10b981" roughness={0.8} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3D AR HOLOGRAM STAGE ([0, 0.02, -3.5]) */}
      {/* ============================================================== */}
      <group position={[0, 0.02, -3.5]}>
        <mesh ref={arHologramRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.8, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <circleGeometry args={[2.4, 32]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* ============================================================ */}
        {/* HIGH-REALISM 3D AR ELEPHANT */}
        {/* ============================================================ */}
        {arType === 'elephant' && (
          <group position={[0, 0, 0]}>
            {/* Sculpted Body with natural back curve */}
            <mesh position={[0, 1.65, 0]} castShadow>
              <sphereGeometry args={[1.25, 24, 24]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} />
            </mesh>
            {/* Shoulders & Hips */}
            <mesh position={[0, 1.7, 0.5]} castShadow>
              <sphereGeometry args={[1.05, 20, 20]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} />
            </mesh>
            <mesh position={[0, 1.6, -0.6]} castShadow>
              <sphereGeometry args={[1.05, 20, 20]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} />
            </mesh>

            {/* Elephant Head */}
            <mesh position={[0, 2.15, 1.15]} castShadow>
              <sphereGeometry args={[0.78, 20, 20]} />
              <meshStandardMaterial color="#64748b" roughness={0.85} />
            </mesh>

            {/* Flapping Ears with Pink Inner Shading */}
            <group ref={elephantEarsRef} position={[0, 2.2, 1.15]}>
              {/* Left Ear */}
              <group position={[-0.85, 0, -0.1]} rotation={[0, -0.4, 0]}>
                <mesh castShadow>
                  <circleGeometry args={[0.72, 24]} />
                  <meshStandardMaterial color="#64748b" side={THREE.DoubleSide} roughness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[0.5, 20]} />
                  <meshStandardMaterial color="#fbcfe8" side={THREE.DoubleSide} roughness={0.8} />
                </mesh>
              </group>

              {/* Right Ear */}
              <group position={[0.85, 0, -0.1]} rotation={[0, 0.4, 0]}>
                <mesh castShadow>
                  <circleGeometry args={[0.72, 24]} />
                  <meshStandardMaterial color="#64748b" side={THREE.DoubleSide} roughness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.01]}>
                  <circleGeometry args={[0.5, 20]} />
                  <meshStandardMaterial color="#fbcfe8" side={THREE.DoubleSide} roughness={0.8} />
                </mesh>
              </group>
            </group>

            {/* Realistic Curved Ivory Tusks */}
            <mesh position={[-0.28, 1.8, 1.7]} rotation={[0.4, -0.2, 0]} castShadow>
              <coneGeometry args={[0.07, 0.65, 12]} />
              <meshStandardMaterial color="#fffbeb" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[0.28, 1.8, 1.7]} rotation={[0.4, 0.2, 0]} castShadow>
              <coneGeometry args={[0.07, 0.65, 12]} />
              <meshStandardMaterial color="#fffbeb" roughness={0.2} metalness={0.1} />
            </mesh>

            {/* Eyes */}
            <mesh position={[-0.34, 2.35, 1.75]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} />
            </mesh>
            <mesh position={[0.34, 2.35, 1.75]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} />
            </mesh>

            {/* Segmented Curling Trunk */}
            <group ref={elephantTrunkRef} position={[0, 1.85, 1.72]}>
              <mesh position={[0, -0.35, 0.1]} rotation={[0.2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.18, 0.14, 0.7, 16]} />
                <meshStandardMaterial color="#64748b" roughness={0.85} />
              </mesh>
              <mesh position={[0, -0.75, 0.35]} rotation={[0.8, 0, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.11, 0.6, 16]} />
                <meshStandardMaterial color="#64748b" roughness={0.85} />
              </mesh>
              <mesh position={[0, -0.85, 0.68]} rotation={[1.5, 0, 0]} castShadow>
                <cylinderGeometry args={[0.11, 0.08, 0.45, 16]} />
                <meshStandardMaterial color="#64748b" roughness={0.85} />
              </mesh>
            </group>

            {/* 4 Sturdy Legs with Foot Pads & Toenails */}
            {[
              [-0.62, 0.75, 0.65],
              [0.62, 0.75, 0.65],
              [-0.62, 0.75, -0.65],
              [0.62, 0.75, -0.65],
            ].map(([lx, ly, lz], idx) => (
              <group key={`leg-${idx}`} position={[lx, ly, lz]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.28, 0.25, 1.5, 16]} />
                  <meshStandardMaterial color="#475569" roughness={0.9} />
                </mesh>
                {/* Toenails */}
                <mesh position={[0, -0.68, 0.22]}>
                  <boxGeometry args={[0.22, 0.08, 0.08]} />
                  <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
                </mesh>
              </group>
            ))}

            {/* Animated Tail */}
            <mesh ref={elephantTailRef} position={[0, 1.45, -1.3]} rotation={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 0.75, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* AR Hologram Light Pillar */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[2.2, 2.5, 5, 24, 1, true]} />
              <meshStandardMaterial
                color="#38bdf8"
                transparent
                opacity={0.16}
                side={THREE.DoubleSide}
                emissive="#0284c7"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>
        )}

        {/* 3D AR COUNTING ORBS */}
        {arType === 'counting_orbs' && (
          <group ref={orbsGroupRef}>
            {[
              { num: 1, color: '#ef4444', pos: [-1.8, 0, 0] },
              { num: 2, color: '#f59e0b', pos: [-0.9, 0.4, 0.4] },
              { num: 3, color: '#10b981', pos: [0, 0.7, 0] },
              { num: 4, color: '#06b6d4', pos: [0.9, 0.4, -0.4] },
              { num: 5, color: '#8b5cf6', pos: [1.8, 0, 0] },
            ].map((orb) => (
              <group key={orb.num} position={orb.pos as [number, number, number]}>
                <mesh>
                  <sphereGeometry args={[0.4, 20, 20]} />
                  <meshStandardMaterial
                    color={orb.color}
                    emissive={orb.color}
                    emissiveIntensity={1.3}
                    roughness={0.1}
                  />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.5, 16, 16]} />
                  <meshStandardMaterial
                    color={orb.color}
                    transparent
                    opacity={0.3}
                    emissive={orb.color}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}

        {/* 3D AR STAR CLUSTER */}
        {arType === 'star_cluster' && (
          <group ref={starClusterRef} position={[0, 1.4, 0]}>
            <mesh>
              <octahedronGeometry args={[0.7, 0]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={1.5}
                metalness={0.8}
              />
            </mesh>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = (i * Math.PI) / 3;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(angle) * 1.5, Math.sin(angle * 2) * 0.4, Math.sin(angle) * 1.5]}
                >
                  <octahedronGeometry args={[0.25, 0]} />
                  <meshStandardMaterial color="#f43f5e" emissive="#ec4899" emissiveIntensity={1.2} />
                </mesh>
              );
            })}
          </group>
        )}
      </group>

      {/* Classroom Physical Exit Sliding Doorway */}
      <group position={[0, 0, 7.85]}>
        <ProximitySlidingDoor3D
          position={[0, 0, 0]}
          playerPos={playerPos}
          doorWidth={3.2}
          doorHeight={3.2}
          triggerDistance={4.8}
          frameColor="#e11d48"
        />

        {/* Exit to Campus Portal Ring */}
        <group position={[0, 0, -1]} onClick={onExitToCampus}>
          <mesh position={[0, 3.8, 0]}>
            <boxGeometry args={[3.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[1.2, 1.6, 32]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
