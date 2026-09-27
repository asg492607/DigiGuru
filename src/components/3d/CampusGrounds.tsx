import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMPUS_ZONES } from '../../data/campusData';
import {
  getGrassTexture,
  getPaverTexture,
  getLimestoneTexture,
} from '../../utils/proceduralTextures';
import { ShivajiStatue3D } from './ShivajiStatue3D';
import { CampusPerimeterGate3D } from './CampusPerimeterGate3D';
import { ProximitySlidingDoor3D } from './ProximitySlidingDoor3D';
import { CampusStreetFurniture } from './CampusStreetFurniture';

interface CampusGroundsProps {
  onEnterBuilding: (buildingId: string, floor?: number) => void;
  onEnterZone: (zoneId: string) => void;
  playerPos: [number, number, number];
}

interface BuildingExteriorSpec {
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
  roofType?: 'parapet' | 'dome' | 'angular' | 'solar';
}

// Modular High-Fidelity Exterior Building Component
const ExteriorBuilding: React.FC<{
  spec: BuildingExteriorSpec;
  limestoneTex: THREE.CanvasTexture;
  onEnterBuilding: (id: string, floor?: number) => void;
  playerPos: [number, number, number];
}> = ({ spec, limestoneTex, onEnterBuilding, playerPos }) => {
  const totalHeight = spec.floorsCount * spec.heightPerFloor;
  const halfH = totalHeight / 2;

  // Door position in world coords
  const doorWorldZ = spec.position[2] + spec.depth * 0.5 + 1.2;
  const distToDoor = Math.hypot(
    playerPos[0] - spec.position[0],
    playerPos[2] - doorWorldZ
  );
  const isNearDoor = distToDoor < 5.5;

  return (
    <group position={spec.position}>
      {/* 1. Heavy Stone Foundation Plinth */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[spec.width + 1.4, 0.9, spec.depth + 1.4]} />
        <meshStandardMaterial map={limestoneTex} roughness={0.6} />
      </mesh>

      {/* 2. Main Multi-Story Structural Shell */}
      <mesh position={[0, 0.9 + halfH, 0]} castShadow receiveShadow>
        <boxGeometry args={[spec.width, totalHeight, spec.depth]} />
        <meshStandardMaterial color={spec.facadeColor} roughness={0.35} />
      </mesh>

      {/* 3. Architectural Floor Dividing Cornices & Window Grids */}
      {Array.from({ length: spec.floorsCount }).map((_, fIdx) => {
        const floorY = 0.9 + fIdx * spec.heightPerFloor;
        return (
          <group key={`ext-floor-${fIdx}`}>
            {/* Horizontal Cornice Belt */}
            <mesh position={[0, floorY, 0]}>
              <boxGeometry args={[spec.width + 0.35, 0.28, spec.depth + 0.35]} />
              <meshStandardMaterial color={spec.trimColor} roughness={0.3} />
            </mesh>

            {/* Recessed Exterior Glass Window Rows (Front Facade) */}
            {[-0.34, -0.12, 0.12, 0.34].map((xFrac, wIdx) => (
              <mesh
                key={`front-win-${fIdx}-${wIdx}`}
                position={[
                  xFrac * spec.width,
                  floorY + spec.heightPerFloor * 0.52,
                  spec.depth * 0.5 + 0.08,
                ]}
              >
                <boxGeometry args={[spec.width * 0.15, spec.heightPerFloor * 0.58, 0.12]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.3}
                  roughness={0.1}
                  metalness={0.85}
                />
              </mesh>
            ))}

            {/* Side Windows */}
            {[-0.25, 0.25].map((zFrac, swIdx) => (
              <mesh
                key={`side-win-${fIdx}-${swIdx}`}
                position={[
                  spec.width * 0.5 + 0.08,
                  floorY + spec.heightPerFloor * 0.52,
                  zFrac * spec.depth,
                ]}
              >
                <boxGeometry args={[0.12, spec.heightPerFloor * 0.58, spec.depth * 0.22]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.2}
                  roughness={0.1}
                  metalness={0.8}
                />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 4. Roof Architecture: Parapet, HVAC, & Solar Canopy */}
      <mesh position={[0, 0.9 + totalHeight + 0.35, 0]} castShadow>
        <boxGeometry args={[spec.width + 0.6, 0.7, spec.depth + 0.6]} />
        <meshStandardMaterial color={spec.trimColor} roughness={0.4} />
      </mesh>
      {/* Rooftop Solar Panels */}
      <mesh position={[0, 0.9 + totalHeight + 0.8, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[spec.width * 0.75, 0.18, spec.depth * 0.65]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 5. Grand Entrance Portico & Automated Double Doors */}
      <group position={[0, 0, spec.depth * 0.5 + 1.2]}>
        {/* Portico Canopy */}
        <mesh position={[0, 4.0, 0]} castShadow>
          <boxGeometry args={[7.0, 0.45, 3.0]} />
          <meshStandardMaterial color={spec.trimColor} roughness={0.3} />
        </mesh>
        {/* Supporting Classical Columns */}
        <mesh position={[-2.8, 2.0, 1.0]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 4.0, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[2.8, 2.0, 1.0]} castShadow>
          <cylinderGeometry args={[0.24, 0.28, 4.0, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        {/* Broad Entrance Steps */}
        <mesh position={[0, 0.25, 0.6]} receiveShadow>
          <boxGeometry args={[5.6, 0.5, 2.4]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>

        {/* Physical Automated Sliding Glass Double Doors */}
        <ProximitySlidingDoor3D
          position={[0, 0, -1.05]}
          playerPos={playerPos}
          doorWidth={3.4}
          doorHeight={3.4}
          triggerDistance={5.5}
          frameColor={spec.trimColor}
        />

        {/* Prominent Illuminated Building Banner Sign */}
        <group position={[0, 4.65, 0.15]}>
          <mesh position={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[7.8, 1.0, 0.15]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[7.5, 0.82, 0.08]} />
            <meshStandardMaterial
              color={spec.accentColor}
              emissive={spec.accentColor}
              emissiveIntensity={isNearDoor ? 1.4 : 0.75}
            />
          </mesh>
        </group>

        {/* Interactive In-World Entrance Trigger Ring & Button */}
        <group
          position={[0, 0.04, 1.6]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding(spec.id, 0);
          }}
        >
          {/* Pulsing Luminous Entry Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color={spec.accentColor}
              emissive={spec.accentColor}
              emissiveIntensity={isNearDoor ? 1.8 : 0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Floating In-World Clickable Badge */}
          {isNearDoor && (
            <group position={[0, 2.2, 0]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[3.2, 0.7, 0.1]} />
                <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.8} />
              </mesh>
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

export const CampusGrounds: React.FC<CampusGroundsProps> = ({
  onEnterBuilding,
  onEnterZone,
  playerPos,
}) => {
  const carouselRef = useRef<THREE.Group>(null);
  const clockHandsRef = useRef<THREE.Group>(null);

  // Procedural textures
  const grassTex = useMemo(() => getGrassTexture(), []);
  const paverTex = useMemo(() => getPaverTexture(), []);
  const limestoneTex = useMemo(() => getLimestoneTexture(), []);

  useFrame((_, delta) => {
    if (carouselRef.current) carouselRef.current.rotation.y += delta * 0.65;
    if (clockHandsRef.current) clockHandsRef.current.rotation.z -= delta * 0.1;
  });

  // Specifications for all 15 Dedicated Academic Buildings
  const academicBuildings: BuildingExteriorSpec[] = useMemo(
    () => [
      // Early Years Sector (South-West)
      {
        id: 'bldg_nursery',
        name: 'Nursery Academic Building',
        gradeSign: 'DIGIGURU • NURSERY FOUNDATION BLOCK',
        position: [-22, 0, 8],
        floorsCount: 2,
        width: 14,
        depth: 12,
        heightPerFloor: 3.8,
        facadeColor: '#fce7f3',
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

      // Primary Wing (Grades 1 to 5) (North-West)
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

      // Middle & Secondary Wing (Grades 6 to 10) (North-East)
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
        accentColor: '#fbbf24',
      },

      // Senior Secondary Wing (Grades 11 & 12) (South-East)
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
    ],
    []
  );

  return (
    <group>
      {/* ============================================================== */}
      {/* 1. EXPANSIVE REALISTIC CAMPUS TERRAIN & GREEN TURF */}
      {/* ============================================================== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial map={grassTex} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Central Campus Quad Circular Lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[52, 64]} />
        <meshStandardMaterial color="#2d6a38" roughness={0.8} />
      </mesh>

      {/* ============================================================== */}
      {/* 2. CHHATRAPATI SHIVAJI MAHARAJ MEMORIAL PLAZA (CAMPUS HEART) */}
      {/* ============================================================== */}
      {/* Central Circular Paver Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[14.5, 64]} />
        <meshStandardMaterial map={paverTex} roughness={0.6} />
      </mesh>
      {/* Outer Plaza Stone Curb */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[14.0, 14.5, 64]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Ring of Ceremonial Marigold Planters around Statue */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI) / 4;
        const radius = 10.5;
        return (
          <group
            key={`planter-${i}`}
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
          >
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

      {/* Park Benches in Quad */}
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

      {/* CROWNING STATUE */}
      <ShivajiStatue3D position={[0, 0, 0]} />

      {/* ============================================================== */}
      {/* 3. RADIAL PEDESTRIAN BOULEVARDS & AVENUES */}
      {/* ============================================================== */}
      {/* South Boulevard (Quad to Gates & Reception) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 26]} receiveShadow>
        <planeGeometry args={[7.5, 52]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* North Academic Promenade (Quad to Library & Auditorium) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -34]} receiveShadow>
        <planeGeometry args={[7.5, 68]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* West Scholar Way */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-26, 0.005, 0]} receiveShadow>
        <planeGeometry args={[52, 7.0]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      {/* East Academic Avenue */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.005, 0]} receiveShadow>
        <planeGeometry args={[52, 7.0]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* Diagonal Avenues */}
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[-18, 0.004, 18]} receiveShadow>
        <planeGeometry args={[5.0, 32]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[18, 0.004, 18]} receiveShadow>
        <planeGeometry args={[5.0, 32]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-20, 0.004, -20]} receiveShadow>
        <planeGeometry args={[5.0, 34]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[20, 0.004, -20]} receiveShadow>
        <planeGeometry args={[5.0, 34]} />
        <meshStandardMaterial map={paverTex} roughness={0.5} />
      </mesh>

      {/* ============================================================== */}
      {/* 4. ALL 15 DEDICATED ACADEMIC GRADE BUILDINGS */}
      {/* ============================================================== */}
      {academicBuildings.map((bldg) => (
        <ExteriorBuilding
          key={bldg.id}
          spec={bldg}
          limestoneTex={limestoneTex}
          onEnterBuilding={onEnterBuilding}
          playerPos={playerPos}
        />
      ))}

      {/* ============================================================== */}
      {/* 5. PHYSICAL PERIMETER GATES & SECURITY ARBOR */}
      {/* ============================================================== */}
      <CampusPerimeterGate3D playerPos={playerPos} />

      {/* ============================================================== */}
      {/* 6. COMMON CAMPUS FACILITIES WITH ENTERABLE ENTRANCES */}
      {/* ============================================================== */}

      {/* MAIN RECEPTION & WELCOME ATRIUM ([0, 0, 32]) */}
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
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 3.1]}
          playerPos={playerPos}
          doorWidth={3.6}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor="#4f46e5"
        />
        {/* Entrance Portal Ring */}
        <group
          position={[0, 0.04, 4.8]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('reception', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color="#8b5cf6"
              emissive="#8b5cf6"
              emissiveIntensity={1.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Sign */}
        <mesh position={[0, 5.2, 3.1]}>
          <boxGeometry args={[9, 0.9, 0.2]} />
          <meshStandardMaterial color="#7c3aed" emissive="#8b5cf6" emissiveIntensity={0.7} />
        </mesh>
      </group>

      {/* ADMINISTRATION & HEALTH CLINIC ([-18, 0, 32]) */}
      <group position={[-18, 0, 32]}>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 9, 12]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.4} />
        </mesh>
        {/* Clock Tower */}
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
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 6.05]}
          playerPos={playerPos}
          doorWidth={3.2}
          doorHeight={3.0}
          triggerDistance={5.5}
        />
        {/* Entrance Portal Ring */}
        <group
          position={[0, 0.04, 7.6]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('administration_health', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={1.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* STUDENT COMMONS & CENTRAL CAFETERIA ([18, 0, 32]) */}
      <group position={[18, 0, 32]}>
        <mesh position={[0, 4.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 9, 12]} />
          <meshStandardMaterial color="#fef3c7" roughness={0.5} />
        </mesh>
        <ProximitySlidingDoor3D
          position={[0, 0, 6.05]}
          playerPos={playerPos}
          doorWidth={3.4}
          doorHeight={3.0}
          triggerDistance={5.5}
          frameColor="#b45309"
        />
        <group
          position={[0, 0.04, 7.6]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('cafeteria_commons', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={1.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Outdoor Pergola Deck */}
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
        </group>
      </group>

      {/* CENTRAL WONDER LIBRARY ([0, 0, -30]) */}
      <group position={[0, 0, -30]}>
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[22, 12, 16]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.4} />
        </mesh>
        {/* Classical Blue Dome */}
        <mesh position={[0, 13.5, 0]} castShadow>
          <sphereGeometry args={[6.5, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Colonnade */}
        {[-8, -5, -2, 2, 5, 8].map((cx, i) => (
          <mesh key={`col-${i}`} position={[cx, 4.5, 8.2]} castShadow>
            <cylinderGeometry args={[0.45, 0.5, 9, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
        {/* Steps */}
        <mesh position={[0, 0.5, 9.5]} receiveShadow>
          <boxGeometry args={[18, 1.0, 3.5]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>
        {/* Door */}
        <ProximitySlidingDoor3D
          position={[0, 0.5, 8.05]}
          playerPos={playerPos}
          doorWidth={4.2}
          doorHeight={3.6}
          triggerDistance={6.0}
          frameColor="#0284c7"
        />
        {/* Library Entrance Ring */}
        <group
          position={[0, 0.04, 11.5]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('library', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.0, 32]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0284c7"
              emissiveIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        <mesh position={[0, 9.8, 8.25]}>
          <boxGeometry args={[12, 1.1, 0.2]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* UNIFIED SCIENCE COMPLEX & BIO-DOME ([16, 0, -52]) */}
      <group position={[16, 0, -52]}>
        <mesh position={[-3, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 12, 12]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Geodesic Dome */}
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
        </group>
        {/* Door */}
        <ProximitySlidingDoor3D
          position={[-3, 0, 6.05]}
          playerPos={playerPos}
          doorWidth={3.4}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor="#0d9488"
        />
        {/* Science Entrance Ring */}
        <group
          position={[-3, 0.04, 7.8]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('science_complex', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color="#14b8a6"
              emissive="#14b8a6"
              emissiveIntensity={1.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* TECHNOLOGY & AI INNOVATION CENTER ([22, 0, 12]) */}
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
        {/* Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 6.55]}
          playerPos={playerPos}
          doorWidth={3.6}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor="#0284c7"
        />
        {/* Tech Hub Entrance Ring */}
        <group
          position={[0, 0.04, 8.2]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('tech_hub', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.8, 32]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* ARTS, MUSIC & CULTURAL CENTER ([-16, 0, -52]) */}
      <group position={[-16, 0, -52]}>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[16, 10, 14]} />
          <meshStandardMaterial color="#faf5ff" roughness={0.4} />
        </mesh>
        {/* Modernist Angular Roof Feature */}
        <mesh position={[0, 10.8, 0]} rotation={[0.08, 0.08, 0]} castShadow>
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
        {/* Entrance Portico & Steps */}
        <mesh position={[0, 0.25, 7.8]} receiveShadow>
          <boxGeometry args={[6.5, 0.5, 2.4]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0, 7.05]}
          playerPos={playerPos}
          doorWidth={3.6}
          doorHeight={3.2}
          triggerDistance={5.5}
          frameColor="#9333ea"
        />
        {/* Entrance Portal Ring */}
        <group
          position={[0, 0.04, 8.8]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('arts_center', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.4, 1.9, 32]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Illuminated Sign */}
        <mesh position={[0, 8.5, 7.15]}>
          <boxGeometry args={[10, 0.9, 0.15]} />
          <meshStandardMaterial color="#7e22ce" emissive="#9333ea" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* GRAND DIGITAL AMPHITHEATER & AUDITORIUM ([0, 0, -64]) */}
      <group position={[0, 0, -64]}>
        <mesh position={[0, 6.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[26, 13, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Proscenium Red Entrance Canopy */}
        <mesh position={[0, 5.5, 8.5]} castShadow>
          <boxGeometry args={[18, 0.8, 5]} />
          <meshStandardMaterial color="#e11d48" roughness={0.3} />
        </mesh>
        {/* Fluted Supporting Columns */}
        {[-7, 7].map((cx, i) => (
          <mesh key={i} position={[cx, 2.75, 10.5]} castShadow>
            <cylinderGeometry args={[0.35, 0.4, 5.5, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
        ))}
        {/* Entrance Steps */}
        <mesh position={[0, 0.35, 9.2]} receiveShadow>
          <boxGeometry args={[14, 0.7, 3.2]} />
          <meshStandardMaterial map={limestoneTex} roughness={0.5} />
        </mesh>
        {/* Entrance Door */}
        <ProximitySlidingDoor3D
          position={[0, 0.35, 8.05]}
          playerPos={playerPos}
          doorWidth={4.4}
          doorHeight={3.6}
          triggerDistance={6.0}
          frameColor="#e11d48"
        />
        {/* Entrance Portal Ring */}
        <group
          position={[0, 0.04, 11.2]}
          onClick={(e) => {
            e.stopPropagation();
            onEnterBuilding('auditorium', 0);
          }}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.6, 2.1, 32]} />
            <meshStandardMaterial
              color="#e11d48"
              emissive="#e11d48"
              emissiveIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Illuminated Marquee Sign */}
        <mesh position={[0, 8.2, 8.2]}>
          <boxGeometry args={[16, 1.4, 0.2]} />
          <meshStandardMaterial color="#e11d48" emissive="#be123c" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ATHLETIC STADIUM & SPORTS ARENA ([-48, 0, -2]) */}
      <group position={[-48, 0, -2]}>
        {/* Tartan Track & Field */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
          <ringGeometry args={[14, 20, 48]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
          <circleGeometry args={[13.5, 36]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>

        {/* Indoor Sports Pavilion Building */}
        <group position={[0, 0, 20]}>
          <mesh position={[0, 5, 0]} castShadow receiveShadow>
            <boxGeometry args={[16, 10, 10]} />
            <meshStandardMaterial color="#0f766e" roughness={0.4} />
          </mesh>
          <mesh position={[0, 10.4, 0]} castShadow>
            <boxGeometry args={[16.6, 0.8, 10.6]} />
            <meshStandardMaterial color="#115e59" />
          </mesh>
          <ProximitySlidingDoor3D
            position={[0, 0, 5.05]}
            playerPos={playerPos}
            doorWidth={3.6}
            doorHeight={3.2}
            triggerDistance={5.5}
            frameColor="#14b8a6"
          />
          {/* Sports Arena Entrance Ring */}
          <group
            position={[0, 0.04, 6.8]}
            onClick={(e) => {
              e.stopPropagation();
              onEnterBuilding('sports_complex', 0);
            }}
          >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 2.0, 32]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={1.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          {/* Illuminated Sign */}
          <mesh position={[0, 5.2, 5.15]}>
            <boxGeometry args={[11, 0.9, 0.15]} />
            <meshStandardMaterial color="#047857" emissive="#10b981" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 7. CAMPUS TREES & FOLIAGE */}
      {/* ============================================================== */}
      {[
        [-12, 0, 12], [12, 0, 12],
        [-12, 0, -12], [12, 0, -12],
        [-5, 0, 22], [5, 0, 22],
        [-5, 0, 36], [5, 0, 36],
        [-5, 0, -20], [5, 0, -20],
        [-5, 0, -36], [5, 0, -36],
        [-20, 0, 5], [-20, 0, -5],
        [-34, 0, 5], [-34, 0, -5],
        [20, 0, 5], [20, 0, -5],
        [34, 0, 5], [34, 0, -5],
        [-56, 0, 28], [-56, 0, -10],
        [56, 0, 28], [56, 0, -10],
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

      {/* Street Lamps */}
      {[
        [-5, 0, 14], [5, 0, 14],
        [-5, 0, 28], [5, 0, 28],
        [-5, 0, -14], [5, 0, -14],
        [-5, 0, -28], [5, 0, -28],
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

      {/* Remaining Zone Fast-Travel Markers */}
      {CAMPUS_ZONES.map((zone) => {
        if (academicBuildings.some((b) => b.id === zone.id)) return null;
        if (
          [
            'library',
            'science_complex',
            'tech_hub',
            'cafeteria_commons',
            'administration_health',
            'reception',
            'sports_complex',
          ].includes(zone.id)
        )
          return null;

        const isNearby =
          Math.hypot(playerPos[0] - zone.position[0], playerPos[2] - zone.position[2]) < 5.0;

        return (
          <group
            key={`zone-marker-${zone.id}`}
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

      {/* Realistic Street Furniture, Buses, Signposts */}
      <CampusStreetFurniture />
    </group>
  );
};
