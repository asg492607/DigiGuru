import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMPUS_ZONES } from '../../data/campusData';
import { getGrassTexture, getPaverTexture, getLimestoneTexture } from '../../utils/proceduralTextures';
import { ShivajiStatue3D } from './ShivajiStatue3D';
import { CampusPerimeterGate3D } from './CampusPerimeterGate3D';
import { ProximitySlidingDoor3D } from './ProximitySlidingDoor3D';
import { CampusStreetFurniture } from './CampusStreetFurniture';

interface CampusGroundsProps {
  onEnterZone: (zoneId: string) => void;
  playerPos: [number, number, number];
}

interface BuildingSpec {
  id: string;
  name: string;
  gradeSign: string;
  position: [number, number, number];
  floorsCount: number;
  width: number;
  depth: number;
  heightPerFloor: number;
  facadeColor: string;
  trimColor: string;
  accentColor: string;
}

// Modular School Academic Building Component
const AcademicBuilding: React.FC<{
  spec: BuildingSpec;
  limestoneTex: THREE.CanvasTexture;
  onEnterZone: (id: string) => void;
  isNearby: boolean;
  playerPos: [number, number, number];
}> = ({ spec, limestoneTex, onEnterZone, isNearby, playerPos }) => {
  const totalHeight = spec.floorsCount * spec.heightPerFloor;
  const halfH = totalHeight / 2;

  return (
    <group position={spec.position}>
      {/* Foundation Plinth */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[spec.width + 1.2, 0.8, spec.depth + 1.2]} />
        <meshStandardMaterial map={limestoneTex} roughness={0.6} />
      </mesh>

      {/* Main Multi-Floor Facade */}
      <mesh position={[0, 0.8 + halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[spec.width, totalHeight, spec.depth]} />
        <meshStandardMaterial color={spec.facadeColor} roughness={0.4} />
      </mesh>

      {/* Floor Dividing Cornices / Moldings */}
      {Array.from({ length: spec.floorsCount }).map((_, fIdx) => {
        const floorY = 0.8 + fIdx * spec.heightPerFloor;
        return (
          <group key={`floor-${fIdx}`}>
            {/* Horizontal Cornice Band */}
            <mesh position={[0, floorY, 0]}>
              <boxGeometry args={[spec.width + 0.3, 0.25, spec.depth + 0.3]} />
              <meshStandardMaterial color={spec.trimColor} roughness={0.3} />
            </mesh>

            {/* Window Bands on Front Facade */}
            {[-0.35, -0.15, 0.05, 0.25].map((xFrac, wIdx) => (
              <mesh
                key={`win-${fIdx}-${wIdx}`}
                position={[xFrac * spec.width, floorY + spec.heightPerFloor * 0.5, spec.depth * 0.5 + 0.08]}
              >
                <boxGeometry args={[spec.width * 0.14, spec.heightPerFloor * 0.55, 0.1]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.35}
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Roof Parapet & Solar Canopy */}
      <mesh position={[0, 0.8 + totalHeight + 0.3, 0]} castShadow>
        <boxGeometry args={[spec.width + 0.6, 0.6, spec.depth + 0.6]} />
        <meshStandardMaterial color={spec.trimColor} roughness={0.4} />
      </mesh>
      {/* Roof Equipment / Solar Cells */}
      <mesh position={[0, 0.8 + totalHeight + 0.7, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[spec.width * 0.7, 0.15, spec.depth * 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Grand Entrance Portico (Ground Floor) */}
      <group position={[0, 0, spec.depth * 0.5 + 1.2]}>
        {/* Portico Canopy */}
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[6.5, 0.4, 2.8]} />
          <meshStandardMaterial color={spec.trimColor} roughness={0.3} />
        </mesh>
        {/* Supporting Pillars */}
        <mesh position={[-2.6, 1.9, 0.9]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 3.8, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[2.6, 1.9, 0.9]} castShadow>
          <cylinderGeometry args={[0.22, 0.25, 3.8, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Entrance Steps */}
        <mesh position={[0, 0.25, 0.5]} receiveShadow>
          <boxGeometry args={[5.2, 0.5, 2.2]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>

        {/* Physical Automated Sliding Glass Double Doors */}
        <ProximitySlidingDoor3D
          position={[0, 0, -1.05]}
          playerPos={playerPos}
          doorWidth={3.2}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor={spec.trimColor}
        />

        {/* Prominent High-Contrast Illuminated Building Banner */}
        <group position={[0, 4.4, 0.15]}>
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[7.2, 0.9, 0.15]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[6.9, 0.75, 0.1]} />
            <meshStandardMaterial
              color={spec.accentColor}
              emissive={spec.accentColor}
              emissiveIntensity={isNearby ? 1.0 : 0.65}
            />
          </mesh>
        </group>
      </group>

      {/* Interactive Zone Arrival Ring */}
      <group
        position={[0, 0.04, spec.depth * 0.5 + 2.8]}
        onClick={() => onEnterZone(spec.id)}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.6, 32]} />
          <meshStandardMaterial
            color={spec.accentColor}
            emissive={spec.accentColor}
            emissiveIntensity={isNearby ? 1.4 : 0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

export const CampusGrounds: React.FC<CampusGroundsProps> = ({ onEnterZone, playerPos }) => {
  const carouselRef = useRef<THREE.Group>(null);
  const clockHandsRef = useRef<THREE.Group>(null);

  // Procedural textures
  const grassTex = useMemo(() => getGrassTexture(), []);
  const paverTex = useMemo(() => getPaverTexture(), []);
  const limestoneTex = useMemo(() => getLimestoneTexture(), []);

  useFrame((_, delta) => {
    if (carouselRef.current) {
      carouselRef.current.rotation.y += delta * 0.65;
    }
    if (clockHandsRef.current) {
      clockHandsRef.current.rotation.z -= delta * 0.1;
    }
  });

  // Specifications for the 15 dedicated academic grade buildings
  const academicBuildings: BuildingSpec[] = useMemo(() => [
    // -------------------------------------------------------------
    // EARLY YEARS SECTOR (SW)
    // -------------------------------------------------------------
    {
      id: 'bldg_nursery',
      name: 'Nursery Academic Building',
      gradeSign: 'DIGIGURU • NURSERY FOUNDATION BLOCK',
      position: [-22, 0, 8],
      floorsCount: 2,
      width: 14,
      depth: 12,
      heightPerFloor: 3.8,
      facadeColor: '#fce7f3', // soft rose/ivory
      trimColor: '#db2777',
      accentColor: '#ec4899',
    },
    {
      id: 'bldg_jkg',
      name: 'Junior KG Academic Building',
      gradeSign: 'DIGIGURU • JUNIOR KG BLOCK',
      position: [-34, 0, 16],
      floorsCount: 2,
      width: 13,
      depth: 11,
      heightPerFloor: 3.8,
      facadeColor: '#e0f2fe',
      trimColor: '#0284c7',
      accentColor: '#06b6d4',
    },
    {
      id: 'bldg_skg',
      name: 'Senior KG Academic Building',
      gradeSign: 'DIGIGURU • SENIOR KG BLOCK',
      position: [-46, 0, 14],
      floorsCount: 2,
      width: 13,
      depth: 11,
      heightPerFloor: 3.8,
      facadeColor: '#ffedd5',
      trimColor: '#ea580c',
      accentColor: '#f97316',
    },

    // -------------------------------------------------------------
    // PRIMARY WING (GRADES 1 TO 5) (NW)
    // -------------------------------------------------------------
    {
      id: 'bldg_g1',
      name: 'Grade 1 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 1 ACADEMIC BLOCK',
      position: [-24, 0, -12],
      floorsCount: 3,
      width: 14,
      depth: 12,
      heightPerFloor: 3.6,
      facadeColor: '#fef3c7',
      trimColor: '#d97706',
      accentColor: '#eab308',
    },
    {
      id: 'bldg_g2',
      name: 'Grade 2 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 2 ACADEMIC BLOCK',
      position: [-36, 0, -18],
      floorsCount: 3,
      width: 14,
      depth: 12,
      heightPerFloor: 3.6,
      facadeColor: '#f8fafc',
      trimColor: '#2563eb',
      accentColor: '#3b82f6',
    },
    {
      id: 'bldg_g3',
      name: 'Grade 3 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 3 ACADEMIC BLOCK',
      position: [-48, 0, -26],
      floorsCount: 3,
      width: 14,
      depth: 12,
      heightPerFloor: 3.6,
      facadeColor: '#ecfdf5',
      trimColor: '#059669',
      accentColor: '#10b981',
    },
    {
      id: 'bldg_g4',
      name: 'Grade 4 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 4 ACADEMIC BLOCK',
      position: [-38, 0, -36],
      floorsCount: 3,
      width: 14,
      depth: 12,
      heightPerFloor: 3.6,
      facadeColor: '#f0fdfa',
      trimColor: '#0d9488',
      accentColor: '#14b8a6',
    },
    {
      id: 'bldg_g5',
      name: 'Grade 5 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 5 ACADEMIC BLOCK',
      position: [-26, 0, -44],
      floorsCount: 3,
      width: 15,
      depth: 13,
      heightPerFloor: 3.6,
      facadeColor: '#f0f9ff',
      trimColor: '#0369a1',
      accentColor: '#0284c7',
    },

    // -------------------------------------------------------------
    // MIDDLE & SECONDARY WING (GRADES 6 TO 10) (NE)
    // -------------------------------------------------------------
    {
      id: 'bldg_g6',
      name: 'Grade 6 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 6 ACADEMIC BLOCK',
      position: [24, 0, -12],
      floorsCount: 4,
      width: 15,
      depth: 13,
      heightPerFloor: 3.5,
      facadeColor: '#eef2ff',
      trimColor: '#4f46e5',
      accentColor: '#6366f1',
    },
    {
      id: 'bldg_g7',
      name: 'Grade 7 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 7 ACADEMIC BLOCK',
      position: [36, 0, -18],
      floorsCount: 4,
      width: 15,
      depth: 13,
      heightPerFloor: 3.5,
      facadeColor: '#f5f3ff',
      trimColor: '#7c3aed',
      accentColor: '#8b5cf6',
    },
    {
      id: 'bldg_g8',
      name: 'Grade 8 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 8 ACADEMIC BLOCK',
      position: [48, 0, -26],
      floorsCount: 4,
      width: 15,
      depth: 13,
      heightPerFloor: 3.5,
      facadeColor: '#faf5ff',
      trimColor: '#9333ea',
      accentColor: '#a855f7',
    },
    {
      id: 'bldg_g9',
      name: 'Grade 9 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 9 ACADEMIC BLOCK',
      position: [38, 0, -36],
      floorsCount: 4,
      width: 15,
      depth: 13,
      heightPerFloor: 3.5,
      facadeColor: '#fdf4ff',
      trimColor: '#c026d3',
      accentColor: '#d946ef',
    },
    {
      id: 'bldg_g10',
      name: 'Grade 10 Academic Block',
      gradeSign: 'DIGIGURU • GRADE 10 BOARD EXAMINATION BLOCK',
      position: [26, 0, -44],
      floorsCount: 4,
      width: 16,
      depth: 14,
      heightPerFloor: 3.5,
      facadeColor: '#f1f5f9',
      trimColor: '#312e81',
      accentColor: '#fbbf24', // Gold trim for 10th board prestige
    },

    // -------------------------------------------------------------
    // SENIOR SECONDARY SECTOR (GRADES 11 & 12) (SE)
    // -------------------------------------------------------------
    {
      id: 'bldg_g11',
      name: 'Grade 11 Senior College Block',
      gradeSign: 'DIGIGURU • GRADE 11 SENIOR COLLEGE',
      position: [34, 0, 18],
      floorsCount: 5,
      width: 16,
      depth: 14,
      heightPerFloor: 3.5,
      facadeColor: '#e2e8f0',
      trimColor: '#0f172a',
      accentColor: '#38bdf8',
    },
    {
      id: 'bldg_g12',
      name: 'Grade 12 Senior College Block',
      gradeSign: 'DIGIGURU • GRADE 12 VALEDICTORIAN HIGH-RISE',
      position: [46, 0, 24],
      floorsCount: 5,
      width: 16,
      depth: 14,
      heightPerFloor: 3.5,
      facadeColor: '#f8fafc',
      trimColor: '#0f172a',
      accentColor: '#f59e0b',
    },
  ], []);

  return (
    <group>
      {/* ============================================================== */}
      {/* EXPANSIVE REALISTIC CAMPUS TERRAIN & GRASS TURF */}
      {/* ============================================================== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial map={grassTex} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Central Campus Quad Lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[52, 64]} />
        <meshStandardMaterial color="#2d6a38" roughness={0.8} />
      </mesh>

      {/* ============================================================== */}
      {/* CENTRAL MEMORIAL PLAZA WITH CHHATRAPATI SHIVAJI MAHARAJ STATUE */}
      {/* ============================================================== */}
      {/* Main Central Circular Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[14.5, 64]} />
        <meshStandardMaterial map={paverTex} roughness={0.6} />
      </mesh>

      {/* Outer Plaza Stone Curb Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[14.0, 14.5, 64]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Ring of Decorative Marigold Planters around Statue Perimeter */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 10.5;
        return (
          <group key={`planter-${i}`} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.9, 1.1, 0.7, 16]} />
              <meshStandardMaterial color="#475569" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.75, 0]} castShadow>
              <sphereGeometry args={[0.8, 12, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* Park Benches in Central Quad */}
      {[
        [-8.5, 0, 7.5, 0.5],
        [8.5, 0, 7.5, -0.5],
        [-8.5, 0, -7.5, 2.6],
        [8.5, 0, -7.5, -2.6],
      ].map(([bx, by, bz, rot], idx) => (
        <group key={`quad-bench-${idx}`} position={[bx, by, bz]} rotation={[0, rot, 0]}>
          <mesh position={[-1, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[1, 0.25, 0]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <boxGeometry args={[2.2, 0.06, 0.4]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.75, -0.18]} rotation={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 0.35, 0.05]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* THE CROWNING CENTRAL LANDMARK: CHHATRAPATI SHIVAJI MAHARAJ MEMORIAL */}
      <ShivajiStatue3D position={[0, 0, 0]} />

      {/* ============================================================== */}
      {/* RADIAL PEDESTRIAN BOULEVARDS & AVENUES */}
      {/* ============================================================== */}
      {/* Grand South Boulevard (Central Quad to Main Reception & Gates) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 26]} receiveShadow>
        <planeGeometry args={[7.5, 52]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* North Academic Promenade (Central Quad to Library & Auditorium) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -34]} receiveShadow>
        <planeGeometry args={[7.5, 68]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* West Scholar Way (Central Quad to Primary Wing & Sports Stadium) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26, 0.005, 0]} receiveShadow>
        <planeGeometry args={[52, 7.0]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* East Academic Avenue (Central Quad to Secondary, Senior College & Tech) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.005, 0]} receiveShadow>
        <planeGeometry args={[52, 7.0]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* Diagonal Avenues */}
      {/* SW Pathway to Early Years */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[-18, 0.004, 18]} receiveShadow>
        <planeGeometry args={[5.0, 32]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* SE Pathway to Senior College & Cafeteria */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[18, 0.004, 18]} receiveShadow>
        <planeGeometry args={[5.0, 32]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* NW Pathway to Senior Primary */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-20, 0.004, -20]} receiveShadow>
        <planeGeometry args={[5.0, 34]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* NE Pathway to Senior Secondary */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[20, 0.004, -20]} receiveShadow>
        <planeGeometry args={[5.0, 34]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* ============================================================== */}
      {/* ALL 15 DEDICATED ACADEMIC GRADE BUILDINGS */}
      {/* ============================================================== */}
      {academicBuildings.map((bldg) => {
        const isNearby =
          Math.hypot(playerPos[0] - bldg.position[0], playerPos[2] - bldg.position[2]) < 6.5;
        return (
          <AcademicBuilding
            key={bldg.id}
            spec={bldg}
            limestoneTex={limestoneTex}
            onEnterZone={onEnterZone}
            isNearby={isNearby}
            playerPos={playerPos}
          />
        );
      })}

      {/* ============================================================== */}
      {/* PHYSICAL CAMPUS ENTRANCE GATES, SECURITY CABIN & PERIMETER WALL */}
      {/* ============================================================== */}
      <CampusPerimeterGate3D playerPos={playerPos} />

      {/* ============================================================== */}
      {/* COMMON CAMPUS FACILITIES */}
      {/* ============================================================== */}

      {/* 2. MAIN RECEPTION & WELCOME ATRIUM ([0, 0, 32]) */}
      <group position={[0, 0, 32]}>
        <mesh position={[0, 5, -2]} castShadow receiveShadow>
          <boxGeometry args={[18, 10, 10]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.4} />
        </mesh>
        {/* Glass Canopy */}
        <mesh position={[0, 4.2, 4.2]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[12, 0.3, 5]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.65} metalness={0.8} />
        </mesh>
        <mesh position={[-5, 2.1, 5.8]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 4.2, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[5, 2.1, 5.8]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 4.2, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Physical Proximity Sliding Glass Doors */}
        <ProximitySlidingDoor3D
          position={[0, 0, 3.1]}
          playerPos={playerPos}
          doorWidth={3.6}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor="#4f46e5"
        />
        {/* Sign */}
        <mesh position={[0, 5.2, 3.1]}>
          <boxGeometry args={[9, 0.9, 0.2]} />
          <meshStandardMaterial color="#7c3aed" emissive="#8b5cf6" emissiveIntensity={0.7} />
        </mesh>
      </group>

      {/* 3. SCHOOL ADMINISTRATION, HEALTH CLINIC & CLOCK TOWER ([-18, 0, 32]) */}
      <group position={[-18, 0, 32]}>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 9, 12]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.4} />
        </mesh>
        {/* Clock Tower Spire */}
        <group position={[0, 9, 0]}>
          <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[3.6, 7, 3.6]} />
            <meshStandardMaterial map={limestoneTex} roughness={0.5} />
          </mesh>
          <mesh position={[0, 8.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.8, 4, 4]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Clock Face */}
          <mesh position={[0, 4.5, 1.82]}>
            <circleGeometry args={[1.2, 32]} />
            <meshStandardMaterial color="#ffffff" emissive="#f8fafc" emissiveIntensity={0.6} />
          </mesh>
          <group ref={clockHandsRef} position={[0, 4.5, 1.85]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.08, 0.9, 0.02]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            <mesh position={[0.35, 0, 0]}>
              <boxGeometry args={[0.7, 0.06, 0.02]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
        </group>
        {/* Medical Cross Sign for Clinic */}
        <mesh position={[0, 4.5, 6.05]}>
          <boxGeometry args={[1.6, 0.5, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, 4.5, 6.05]}>
          <boxGeometry args={[0.5, 1.6, 0.1]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.8} />
        </mesh>
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 6.05]}
          playerPos={playerPos}
          doorWidth={3.2}
          doorHeight={3.0}
          triggerDistance={5.5}
        />
      </group>

      {/* 4. STUDENT COMMONS & CENTRAL CAFETERIA ([18, 0, 32]) */}
      <group position={[18, 0, 32]}>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 9, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 6.05]}
          playerPos={playerPos}
          doorWidth={3.4}
          doorHeight={3.0}
          triggerDistance={5.5}
          frameColor="#b45309"
        />
        {/* Shaded Timber Pergola Dining Patio */}
        <group position={[0, 0, 7.5]}>
          <mesh position={[0, 0.15, 0]} receiveShadow>
            <boxGeometry args={[12, 0.3, 5]} />
            <meshStandardMaterial map={paverTex} roughness={0.6} />
          </mesh>
          {[-5, 0, 5].map((px, i) => (
            <mesh key={`post-${i}`} position={[px, 1.6, 2.2]} castShadow>
              <boxGeometry args={[0.25, 3.2, 0.25]} />
              <meshStandardMaterial color="#78350f" roughness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 3.3, 0]}>
            <boxGeometry args={[12.5, 0.15, 5.2]} />
            <meshStandardMaterial color="#92400e" roughness={0.6} />
          </mesh>
          {/* Outdoor Dining Tables */}
          {[-3, 3].map((tx, idx) => (
            <group key={`dining-${idx}`} position={[tx, 0.45, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.22, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.44, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 5. CENTRAL WONDER LIBRARY & MEDIA SANCTUARY ([0, 0, -30]) */}
      <group position={[0, 0, -30]}>
        {/* Classical Rotunda / Library Building */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[22, 12, 16]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.4} />
        </mesh>
        {/* Classical Blue Dome */}
        <mesh position={[0, 13.5, 0]} castShadow>
          <sphereGeometry args={[6.5, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Classical Colonnade on Front Facade */}
        {[-8, -5, -2, 2, 5, 8].map((cx, i) => (
          <mesh key={`col-${i}`} position={[cx, 4.5, 8.2]} castShadow>
            <cylinderGeometry args={[0.45, 0.5, 9, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
        {/* Grand Steps */}
        <mesh position={[0, 0.5, 9.5]} receiveShadow>
          <boxGeometry args={[18, 1.0, 3.5]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>
        {/* Grand Entrance Sliding Glass Doors */}
        <ProximitySlidingDoor3D
          position={[0, 0.5, 8.05]}
          playerPos={playerPos}
          doorWidth={4.2}
          doorHeight={3.6}
          triggerDistance={6.0}
          frameColor="#0284c7"
        />
        {/* Sign */}
        <mesh position={[0, 9.8, 8.25]}>
          <boxGeometry args={[12, 1.1, 0.2]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 6. UNIFIED SCIENCE COMPLEX & BIO-DOME ([16, 0, -52]) */}
      <group position={[16, 0, -52]}>
        <mesh position={[-3, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 12, 12]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Geodesic Bio-Dome */}
        <group position={[5, 0, 0]}>
          <mesh position={[0, 5, 0]} castShadow>
            <sphereGeometry args={[7, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#2dd4bf"
              transparent
              opacity={0.65}
              roughness={0.1}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[2.2, 16, 16]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0284c7" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 7. ARTS, MUSIC & CULTURAL CENTER ([-16, 0, -52]) */}
      <group position={[-16, 0, -52]}>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[16, 10, 14]} />
          <meshStandardMaterial color="#faf5ff" roughness={0.4} />
        </mesh>
        {/* Modernist Angular Roof Feature */}
        <mesh position={[0, 10.8, 0]} rotation={[0.1, 0.1, 0]} castShadow>
          <boxGeometry args={[16.5, 1.2, 14.5]} />
          <meshStandardMaterial color="#9333ea" roughness={0.3} />
        </mesh>
        {/* Stained Glass Art Ribbon */}
        {[-5, 0, 5].map((gx, i) => (
          <mesh key={`art-glass-${i}`} position={[gx, 5.5, 7.1]}>
            <boxGeometry args={[3.2, 4.5, 0.1]} />
            <meshStandardMaterial
              color={i === 0 ? '#ec4899' : i === 1 ? '#a855f7' : '#3b82f6'}
              emissive={i === 0 ? '#db2777' : i === 1 ? '#9333ea' : '#2563eb'}
              emissiveIntensity={0.7}
            />
          </mesh>
        ))}
      </group>

      {/* 8. GRAND DIGITAL AMPHITHEATER & AUDITORIUM ([0, 0, -64]) */}
      <group position={[0, 0, -64]}>
        <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[28, 13, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Sweeping Red Proscenium Canopy */}
        <mesh position={[0, 5.5, 8.5]} castShadow>
          <boxGeometry args={[18, 0.8, 5]} />
          <meshStandardMaterial color="#e11d48" roughness={0.3} />
        </mesh>
        <mesh position={[0, 8.2, 8.2]}>
          <boxGeometry args={[16, 1.5, 0.2]} />
          <meshStandardMaterial color="#e11d48" emissive="#be123c" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 9. TECHNOLOGY & AI INNOVATION CENTER ([22, 0, 12]) */}
      <group position={[22, 0, 12]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[15, 12, 13]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Glowing Circuit Blue Lines */}
        {[-4, 0, 4].map((lx, i) => (
          <mesh key={`circuit-${i}`} position={[lx, 6, 6.55]}>
            <boxGeometry args={[0.3, 8, 0.05]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
          </mesh>
        ))}
        {/* AI Communications Antenna */}
        <mesh position={[0, 14, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.15, 6, 8]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.9} />
        </mesh>
        <mesh position={[0, 17, 0]}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* 10. ATHLETIC STADIUM & ADVENTURE PLAYGROUND ([-48, 0, -2]) */}
      <group position={[-48, 0, -2]}>
        {/* Red Tartan Synthetic Running Track */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
          <ringGeometry args={[14, 20, 48]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        {/* Central Green Soccer Field */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
          <circleGeometry args={[13.5, 36]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Nursery Adventure Playground Equipment */}
        <group position={[0, 0, 12]}>
          {/* Slide Tower */}
          <group position={[-4, 0, 0]}>
            <mesh position={[0, 2.5, 0]} castShadow>
              <boxGeometry args={[2, 5, 2]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
            <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[1.6, 1.5, 4]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[2, 1.8, 1.8]} rotation={[0.4, 0.6, -0.6]} castShadow>
              <boxGeometry args={[1, 0.3, 5]} />
              <meshStandardMaterial color="#eab308" roughness={0.2} metalness={0.4} />
            </mesh>
          </group>

          {/* Merry-Go-Round */}
          <group ref={carouselRef} position={[4, 0.4, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[2.5, 2.6, 0.3, 16]} />
              <meshStandardMaterial color="#a855f7" />
            </mesh>
            {[0, 1, 2, 3].map((i) => {
              const angle = (i * Math.PI) / 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 1.8, 0.6, Math.sin(angle) * 1.8]} castShadow>
                  <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
                  <meshStandardMaterial color="#fbbf24" metalness={0.8} />
                </mesh>
              );
            })}
          </group>
        </group>
      </group>

      {/* ============================================================== */}
      {/* ORGANIC CAMPUS TREES & FOLIAGE */}
      {/* ============================================================== */}
      {[
        // Central Quad surrounding trees
        [-12, 0, 12], [12, 0, 12],
        [-12, 0, -12], [12, 0, -12],
        // Avenue tree borders
        [-5, 0, 22], [5, 0, 22],
        [-5, 0, 36], [5, 0, 36],
        [-5, 0, -20], [5, 0, -20],
        [-5, 0, -36], [5, 0, -36],
        [-20, 0, 5], [-20, 0, -5],
        [-34, 0, 5], [-34, 0, -5],
        [20, 0, 5], [20, 0, -5],
        [34, 0, 5], [34, 0, -5],
        // Perimeter campus clusters
        [-56, 0, 28], [-56, 0, -10],
        [56, 0, 28], [56, 0, -10],
        [-28, 0, 32], [28, 0, 32],
      ].map(([x, y, z], idx) => (
        <group key={`tree-${idx}`} position={[x, y, z]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.38, 3.6, 12]} />
            <meshStandardMaterial color="#5c3817" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.8, 0]} castShadow>
            <sphereGeometry args={[1.9, 16, 16]} />
            <meshStandardMaterial color={idx % 3 === 0 ? '#15803d' : '#16a34a'} roughness={0.8} />
          </mesh>
          <mesh position={[0, 5.2, 0]} castShadow>
            <sphereGeometry args={[1.4, 14, 14]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Campus Street Lamps with Warm Glow */}
      {[
        [-5, 0, 14], [5, 0, 14],
        [-5, 0, 28], [5, 0, 28],
        [-5, 0, -14], [5, 0, -14],
        [-5, 0, -28], [5, 0, -28],
        [-16, 0, 4], [-28, 0, 4],
        [16, 0, 4], [28, 0, 4],
      ].map(([lx, ly, lz], i) => (
        <group key={`lamp-${i}`} position={[lx, ly, lz]}>
          <mesh position={[0, 2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 4.1, 0]}>
            <sphereGeometry args={[0.28, 12, 12]} />
            <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.1} />
          </mesh>
        </group>
      ))}

      {/* Interactive Zone Markers for all remaining landmarks & facilities */}
      {CAMPUS_ZONES.map((zone) => {
        // Skip if handled by academic building
        if (academicBuildings.some((b) => b.id === zone.id)) return null;

        const isNearby =
          Math.hypot(playerPos[0] - zone.position[0], playerPos[2] - zone.position[2]) < 5.0;

        return (
          <group
            key={`marker-${zone.id}`}
            position={zone.position}
            onClick={() => onEnterZone(zone.id)}
          >
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
              <ringGeometry args={[1.4, 1.8, 32]} />
              <meshStandardMaterial
                color={zone.color}
                emissive={zone.color}
                emissiveIntensity={isNearby ? 1.4 : 0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Master Realistic Campus Street Furniture, Buses, Signposts & Sports Equipment */}
      <CampusStreetFurniture />
    </group>
  );
};
