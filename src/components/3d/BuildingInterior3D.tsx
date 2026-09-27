import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMPUS_ZONES } from '../../data/campusData';
import type { LessonStep } from '../../types/campus';
import {
  getOakWoodTexture,
  getLimestoneTexture,
  getSmartBoardTexture,
} from '../../utils/proceduralTextures';
import { ElevatorLift3D } from './ElevatorLift3D';
import { StaircaseZone3D } from './StaircaseZone3D';
import { ProximitySlidingDoor3D } from './ProximitySlidingDoor3D';

interface BuildingInterior3DProps {
  buildingId: string;
  currentFloor: number;
  onChangeFloor: (floor: number) => void;
  onExitToCampus: () => void;
  playerPos?: [number, number, number];
  currentStep?: LessonStep;
}

export const BuildingInterior3D: React.FC<BuildingInterior3DProps> = ({
  buildingId,
  currentFloor,
  onChangeFloor,
  onExitToCampus,
  playerPos = [0, 0, 0],
  currentStep: _currentStep,
}) => {
  const fanRef1 = useRef<THREE.Group>(null);
  const fanRef2 = useRef<THREE.Group>(null);
  const holoSphereRef = useRef<THREE.Mesh>(null);
  const robotArmRef = useRef<THREE.Group>(null);
  const stageSpotlightRef = useRef<THREE.Group>(null);

  // Procedural textures
  const woodTex = useMemo(() => getOakWoodTexture(), []);
  const limestoneTex = useMemo(() => getLimestoneTexture(), []);
  const smartBoardTex = useMemo(() => getSmartBoardTexture(), []);

  // Retrieve building metadata from CAMPUS_ZONES
  const zoneData = useMemo(() => {
    return CAMPUS_ZONES.find((z) => z.id === buildingId) || CAMPUS_ZONES[3];
  }, [buildingId]);

  const floorsCount = Math.max(zoneData.floorsCount || 2, 2);

  const floorNamesList = useMemo(() => {
    return Array.from({ length: floorsCount }).map((_, idx) => {
      return (
        zoneData.floorsDetail?.[idx]?.name ||
        (idx === 0 ? 'Ground Floor' : `Floor ${idx}`)
      );
    });
  }, [floorsCount, zoneData]);

  // Ambient animations
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (fanRef1.current) fanRef1.current.rotation.y += delta * 4;
    if (fanRef2.current) fanRef2.current.rotation.y += delta * 4;
    if (holoSphereRef.current) {
      holoSphereRef.current.rotation.y += delta * 0.7;
      holoSphereRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (robotArmRef.current) {
      robotArmRef.current.rotation.y = Math.sin(time * 1.5) * 0.4;
    }
    if (stageSpotlightRef.current) {
      stageSpotlightRef.current.rotation.y = Math.sin(time * 0.8) * 0.3;
    }
  });

  // Building Category Checks
  const isNursery = buildingId === 'bldg_nursery';
  const isEarlyYearsOther = buildingId === 'bldg_jkg' || buildingId === 'bldg_skg';
  const isPrimary = zoneData.category === 'primary';
  const isSecondary = zoneData.category === 'secondary';
  const isSeniorSecondary = zoneData.category === 'senior_secondary';
  const isLibrary = buildingId === 'library';
  const isScience = buildingId === 'science_complex';
  const isTech = buildingId === 'tech_hub';
  const isArts = buildingId === 'arts_center';
  const isAuditorium = buildingId === 'auditorium';
  const isCafeteria = buildingId === 'cafeteria_commons';
  const isAdminClinic = buildingId === 'administration_health';
  const isReception = buildingId === 'reception';
  const isSports = buildingId === 'sports_complex';

  return (
    <group position={[0, 0, 0]}>
      {/* ============================================================== */}
      {/* 1. ARCHITECTURAL ROOM ENVELOPE (24m x 22m x 6.5m) */}
      {/* ============================================================== */}
      {/* Flooring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 22]} />
        <meshStandardMaterial
          map={
            isNursery || isEarlyYearsOther || isPrimary || isArts
              ? woodTex
              : isReception || isLibrary || isAdminClinic
              ? limestoneTex
              : undefined
          }
          color={
            isScience || isTech
              ? '#0f172a'
              : isSports
              ? '#b45309'
              : isAuditorium
              ? '#1e1b4b'
              : isNursery || isEarlyYearsOther || isPrimary || isArts
              ? '#ffffff'
              : '#f8fafc'
          }
          roughness={isScience || isTech ? 0.2 : 0.35}
          metalness={isTech ? 0.4 : 0.05}
        />
      </mesh>

      {/* Ceiling with Recessed Acoustic Panels */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.5, 0]}>
        <planeGeometry args={[24, 22]} />
        <meshStandardMaterial
          color={isAuditorium ? '#0f172a' : '#f8fafc'}
          roughness={0.8}
        />
      </mesh>

      {/* 8 Soft Recessed LED Diffuser Light Panels on Ceiling */}
      {[
        [-6, 6.45, -6], [6, 6.45, -6],
        [-6, 6.45, 0], [6, 6.45, 0],
        [-6, 6.45, 6], [6, 6.45, 6],
        [0, 6.45, -3], [0, 6.45, 4],
      ].map(([lx, ly, lz], idx) => (
        <group key={`interior-led-${idx}`} position={[lx, ly, lz]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.8, 1.4]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f8fafc"
              emissiveIntensity={isAuditorium ? 0.6 : 1.4}
            />
          </mesh>
          <pointLight
            position={[0, -0.2, 0]}
            intensity={isAuditorium ? 0.5 : 0.9}
            distance={10}
            color="#fffbeb"
          />
        </group>
      ))}

      {/* Back Wall (North: holds Elevator & Stairs) */}
      <mesh position={[0, 3.25, -11]} castShadow receiveShadow>
        <boxGeometry args={[24, 6.5, 0.4]} />
        <meshStandardMaterial
          color={isAuditorium ? '#1e1b4b' : isTech ? '#0f172a' : '#e2e8f0'}
          roughness={0.5}
        />
      </mesh>
      {/* Baseboard trim on Back Wall */}
      <mesh position={[0, 0.15, -10.75]}>
        <boxGeometry args={[24, 0.3, 0.1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Front Entrance Wall (South: holds Sliding Exit Door) */}
      <mesh position={[-7.5, 3.25, 11]} castShadow receiveShadow>
        <boxGeometry args={[9, 6.5, 0.4]} />
        <meshStandardMaterial
          color={isAuditorium ? '#1e1b4b' : '#e2e8f0'}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[7.5, 3.25, 11]} castShadow receiveShadow>
        <boxGeometry args={[9, 6.5, 0.4]} />
        <meshStandardMaterial
          color={isAuditorium ? '#1e1b4b' : '#e2e8f0'}
          roughness={0.5}
        />
      </mesh>
      {/* Wall Header over Exit Door */}
      <mesh position={[0, 5.25, 11]} castShadow>
        <boxGeometry args={[6, 2.5, 0.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>

      {/* Left Wall (West: ribbon daylight windows) */}
      <mesh position={[-12, 3.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 6.5, 22]} />
        <meshStandardMaterial
          color={isAuditorium ? '#1e1b4b' : '#f1f5f9'}
          roughness={0.5}
        />
      </mesh>
      {/* 4 Large Windows (unless Auditorium which is blackout) */}
      {!isAuditorium &&
        [-7, -2.5, 2.5, 7].map((zPos, wIdx) => (
          <group key={`window-l-${wIdx}`} position={[-11.75, 3.2, zPos]}>
            <mesh>
              <boxGeometry args={[0.1, 4.2, 3.0]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.25}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>
          </group>
        ))}

      {/* Right Wall (East) */}
      <mesh position={[12, 3.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 6.5, 22]} />
        <meshStandardMaterial
          color={isAuditorium ? '#1e1b4b' : '#f1f5f9'}
          roughness={0.5}
        />
      </mesh>

      {/* Ceiling Fans */}
      {!isAuditorium && (
        <>
          <group ref={fanRef1} position={[-4, 6.0, -2]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {[0, 1, 2].map((blade) => {
              const angle = (blade * Math.PI * 2) / 3;
              return (
                <mesh
                  key={blade}
                  position={[Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[1.3, 0.02, 0.16]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
              );
            })}
          </group>

          <group ref={fanRef2} position={[4, 6.0, 2]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            {[0, 1, 2].map((blade) => {
              const angle = (blade * Math.PI * 2) / 3;
              return (
                <mesh
                  key={blade}
                  position={[Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7]}
                  rotation={[0, angle, 0]}
                >
                  <boxGeometry args={[1.3, 0.02, 0.16]} />
                  <meshStandardMaterial color="#ffffff" />
                </mesh>
              );
            })}
          </group>
        </>
      )}

      {/* ============================================================== */}
      {/* 2. THE LIFT & STAIRWELL CORE (North Wall) */}
      {/* ============================================================== */}
      {/* 3D Automated Elevator / Lift with sliding steel doors */}
      <ElevatorLift3D
        position={[-4.5, 0, -10.6]}
        floorsCount={floorsCount}
        currentFloor={currentFloor}
        onChangeFloor={onChangeFloor}
        playerPos={playerPos}
        floorNames={floorNamesList}
      />

      {/* 3D Physical Staircase with treads, railings & up/down triggers */}
      <StaircaseZone3D
        position={[4.5, 0, -8.2]}
        floorsCount={floorsCount}
        currentFloor={currentFloor}
        onChangeFloor={onChangeFloor}
        playerPos={playerPos}
      />

      {/* Central Corridor Floor Directory Board */}
      <group position={[0, 3.2, -10.75]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 2.2, 0.1]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.7, 0.06]}>
          <boxGeometry args={[3.5, 0.55, 0.02]} />
          <meshStandardMaterial
            color={zoneData.accentColor || zoneData.color}
            emissive={zoneData.accentColor || zoneData.color}
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh position={[0, 0.1, 0.06]}>
          <boxGeometry args={[3.4, 0.45, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* 3. CAMPUS EXIT PORTAL (South Wall) */}
      {/* ============================================================== */}
      <group position={[0, 0, 10.8]}>
        <ProximitySlidingDoor3D
          position={[0, 0, 0]}
          playerPos={playerPos}
          doorWidth={3.8}
          doorHeight={3.6}
          triggerDistance={5.0}
          frameColor={zoneData.color}
        />
        <group
          position={[0, 0, -1.2]}
          onClick={(e) => {
            e.stopPropagation();
            onExitToCampus();
          }}
        >
          <mesh position={[0, 4.2, 0]}>
            <boxGeometry args={[3.6, 0.65, 0.15]} />
            <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={1.2} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.4, 1.9, 32]} />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 4. THEMATIC 3D INTERIOR BY BUILDING & FLOOR */}
      {/* ============================================================== */}

      {/* --- A. NURSERY (bldg_nursery) --- */}
      {isNursery && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            <>
              {/* Circular Rainbow Play & Circle-Time Rug */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <circleGeometry args={[4.2, 48]} />
                <meshStandardMaterial color="#f472b6" roughness={0.9} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
                <ringGeometry args={[3.8, 4.2, 48]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.8} />
              </mesh>

              {/* Central 3D AR Hologram Stage Pedestal */}
              <group position={[0, 0, -1]}>
                <mesh position={[0, 0.15, 0]} receiveShadow>
                  <cylinderGeometry args={[2.4, 2.6, 0.3, 32]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.31, 0]}>
                  <ringGeometry args={[2.2, 2.38, 32]} />
                  <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
                </mesh>
              </group>

              {/* Toddler Round Desks & Stools */}
              {[-6, 6].map((dx, i) => (
                <group key={`toddler-table-${i}`} position={[dx, 0, -2]}>
                  <mesh position={[0, 0.55, 0]} castShadow>
                    <cylinderGeometry args={[1.2, 1.2, 0.08, 24]} />
                    <meshStandardMaterial color={i === 0 ? '#38bdf8' : '#fbbf24'} roughness={0.3} />
                  </mesh>
                  <mesh position={[0, 0.27, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.54, 8]} />
                    <meshStandardMaterial color="#475569" metalness={0.7} />
                  </mesh>
                  {[0, 1, 2, 3].map((s) => {
                    const ang = (s * Math.PI) / 2;
                    return (
                      <mesh
                        key={s}
                        position={[Math.cos(ang) * 1.5, 0.25, Math.sin(ang) * 1.5]}
                        castShadow
                      >
                        <cylinderGeometry args={[0.26, 0.26, 0.5, 16]} />
                        <meshStandardMaterial color="#f43f5e" roughness={0.5} />
                      </mesh>
                    );
                  })}
                </group>
              ))}

              {/* Alphabet & Counting Blocks Tower */}
              <group position={[-7, 0, 4]}>
                {['A', 'B', 'C'].map((_, bIdx) => (
                  <mesh key={bIdx} position={[0, 0.35 + bIdx * 0.65, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial
                      color={bIdx === 0 ? '#ef4444' : bIdx === 1 ? '#3b82f6' : '#10b981'}
                    />
                  </mesh>
                ))}
              </group>
            </>
          ) : (
            <>
              {/* Nursery Storybook Loft */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <circleGeometry args={[5.0, 48]} />
                <meshStandardMaterial color="#c084fc" roughness={0.9} />
              </mesh>
              {[-3, 0, 3].map((bz, idx) => (
                <group key={`bookshelf-${idx}`} position={[11.2, 0, bz]} rotation={[0, -Math.PI / 2, 0]}>
                  <mesh position={[0, 1.6, 0]} castShadow>
                    <boxGeometry args={[2.4, 3.2, 0.5]} />
                    <meshStandardMaterial map={woodTex} roughness={0.4} />
                  </mesh>
                  {[0.6, 1.3, 2.0, 2.7].map((by, sIdx) => (
                    <mesh key={sIdx} position={[0, by, 0.05]}>
                      <boxGeometry args={[2.2, 0.45, 0.35]} />
                      <meshStandardMaterial
                        color={sIdx % 2 === 0 ? '#38bdf8' : '#f59e0b'}
                        roughness={0.7}
                      />
                    </mesh>
                  ))}
                </group>
              ))}
              {[-3, 0, 3].map((bx, idx) => (
                <mesh key={`beanbag-${idx}`} position={[bx, 0.3, -2]} castShadow>
                  <sphereGeometry args={[0.65, 16, 16]} />
                  <meshStandardMaterial
                    color={idx === 0 ? '#f43f5e' : idx === 1 ? '#06b6d4' : '#84cc16'}
                    roughness={0.9}
                  />
                </mesh>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- B. JUNIOR KG & SENIOR KG (bldg_jkg, bldg_skg) --- */}
      {isEarlyYearsOther && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Phonics & Word Discovery Room */
            <>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <circleGeometry args={[4.5, 32]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.8} />
              </mesh>
              {/* Phonics Chart Banner on East Wall */}
              <group position={[11.75, 3.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[7.0, 2.8, 0.1]} />
                  <meshStandardMaterial color="#fef08a" />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                  <boxGeometry args={[6.6, 2.4, 0.02]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0369a1" emissiveIntensity={0.4} />
                </mesh>
              </group>
              {/* Round Group Tables */}
              {[-5, 5].map((tx, idx) => (
                <group key={`jkg-table-${idx}`} position={[tx, 0, -1]}>
                  <mesh position={[0, 0.6, 0]} castShadow>
                    <cylinderGeometry args={[1.5, 1.5, 0.08, 24]} />
                    <meshStandardMaterial color={idx === 0 ? '#f97316' : '#10b981'} roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
                    <meshStandardMaterial color="#475569" />
                  </mesh>
                </group>
              ))}
            </>
          ) : (
            /* Music, Rhythm & Construction Lab */
            <>
              {/* Giant Piano Floor Mat */}
              <group position={[0, 0.02, 0]}>
                {[-3, -2, -1, 0, 1, 2, 3].map((px, i) => (
                  <mesh key={i} position={[px * 0.9, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.8, 3.5]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} />
                  </mesh>
                ))}
              </group>
              {/* Wooden Abacus and Building Block Benches */}
              {[-6, 6].map((bx, idx) => (
                <mesh key={idx} position={[bx, 0.45, -2]} castShadow>
                  <boxGeometry args={[2.0, 0.9, 1.2]} />
                  <meshStandardMaterial map={woodTex} />
                </mesh>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- C. PRIMARY BLOCKS (bldg_g1 to bldg_g5) --- */}
      {isPrimary && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Floor 0: Classroom Rows of Wooden Desks & Chalkboard */
            <>
              <group position={[11.75, 3.0, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[7.2, 3.2, 0.1]} />
                  <meshStandardMaterial map={smartBoardTex} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                  <boxGeometry args={[6.8, 2.8, 0.02]} />
                  <meshStandardMaterial color="#0f766e" emissive="#0d9488" emissiveIntensity={0.2} />
                </mesh>
              </group>

              {[-4, -1, 2].map((rowZ, rIdx) =>
                [-5, -1, 3].map((colX, cIdx) => (
                  <group key={`desk-${rIdx}-${cIdx}`} position={[colX, 0, rowZ]}>
                    <mesh position={[0, 0.72, 0]} castShadow>
                      <boxGeometry args={[1.4, 0.06, 0.7]} />
                      <meshStandardMaterial map={woodTex} roughness={0.4} />
                    </mesh>
                    <mesh position={[-0.6, 0.36, 0]}>
                      <cylinderGeometry args={[0.03, 0.03, 0.72, 8]} />
                      <meshStandardMaterial color="#334155" metalness={0.8} />
                    </mesh>
                    <mesh position={[0.6, 0.36, 0]}>
                      <cylinderGeometry args={[0.03, 0.03, 0.72, 8]} />
                      <meshStandardMaterial color="#334155" metalness={0.8} />
                    </mesh>
                    <mesh position={[0, 0.44, 0.55]} castShadow>
                      <boxGeometry args={[0.55, 0.04, 0.5]} />
                      <meshStandardMaterial color="#0284c7" />
                    </mesh>
                    <mesh position={[0, 0.78, 0.78]} castShadow>
                      <boxGeometry args={[0.55, 0.4, 0.04]} />
                      <meshStandardMaterial color="#0284c7" />
                    </mesh>
                  </group>
                ))
              )}
            </>
          ) : currentFloor === 1 ? (
            /* Floor 1: Math & Science Lab */
            <>
              {[-3, 3].map((bx, idx) => (
                <group key={`lab-bench-${idx}`} position={[bx, 0, 0]}>
                  <mesh position={[0, 0.85, 0]} castShadow>
                    <boxGeometry args={[2.0, 0.1, 7.0]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.2} />
                  </mesh>
                  <mesh position={[0, 0.4, 0]}>
                    <boxGeometry args={[1.8, 0.8, 6.6]} />
                    <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
                  </mesh>
                  <mesh position={[0, 1.2, -2]} castShadow>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color="#0284c7" roughness={0.5} />
                  </mesh>
                  <mesh position={[0, 1.05, 1]} castShadow>
                    <boxGeometry args={[0.6, 0.35, 0.15]} />
                    <meshStandardMaterial color="#d97706" />
                  </mesh>
                </group>
              ))}
            </>
          ) : (
            /* Floor 2: Activity Studio & Project Showcase */
            <>
              <mesh position={[0, 0.15, 0]} receiveShadow>
                <cylinderGeometry args={[3.2, 3.4, 0.3, 32]} />
                <meshStandardMaterial color="#0284c7" roughness={0.4} />
              </mesh>
              {[-4, 4].map((ex, idx) => (
                <group key={`easel-${idx}`} position={[ex, 0, -2]}>
                  <mesh position={[0, 1.4, 0]} rotation={[0.15, 0, 0]} castShadow>
                    <boxGeometry args={[1.0, 1.2, 0.05]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.7, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
                    <meshStandardMaterial map={woodTex} />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- D. SECONDARY BLOCKS (bldg_g6 to bldg_g10) --- */}
      {isSecondary && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Floor 0: Student Lockers Hall & Homeroom */
            <group position={[0, 1.6, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.4, 3.2, 9.0]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
              </mesh>
              {[-3.5, -2, -0.5, 1, 2.5].map((lz, idx) => (
                <group key={idx}>
                  <mesh position={[0.72, 0, lz]}>
                    <boxGeometry args={[0.04, 2.8, 1.1]} />
                    <meshStandardMaterial color="#3b82f6" metalness={0.7} />
                  </mesh>
                  <mesh position={[-0.72, 0, lz]}>
                    <boxGeometry args={[0.04, 2.8, 1.1]} />
                    <meshStandardMaterial color="#3b82f6" metalness={0.7} />
                  </mesh>
                </group>
              ))}
            </group>
          ) : currentFloor === 1 ? (
            /* Floor 1: Chemistry & Physics Demonstration Lab */
            <>
              {[-3.5, 3.5].map((lx, i) => (
                <group key={`chem-bench-${i}`} position={[lx, 0, 0]}>
                  <mesh position={[0, 0.9, 0]} castShadow>
                    <boxGeometry args={[2.4, 0.1, 8.0]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.1} />
                  </mesh>
                  <mesh position={[0, 0.42, 0]}>
                    <boxGeometry args={[2.2, 0.85, 7.6]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                  </mesh>
                  {[-2, 0, 2].map((bz, bIdx) => (
                    <group key={bIdx} position={[0, 1.05, bz]}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.12, 0.14, 0.28, 16]} />
                        <meshStandardMaterial color="#38bdf8" transparent opacity={0.75} roughness={0.1} />
                      </mesh>
                      <mesh position={[0.3, 0.08, 0]}>
                        <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
                        <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
                      </mesh>
                    </group>
                  ))}
                </group>
              ))}
              <group position={[11.75, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[7.5, 3.4, 0.1]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
                <mesh position={[0, 0, 0.06]}>
                  <boxGeometry args={[7.2, 3.1, 0.02]} />
                  <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={0.6} />
                </mesh>
              </group>
            </>
          ) : currentFloor === 2 ? (
            /* Floor 2: Coordinate Geometry & Debate Horseshoe Seminar */
            <group position={[0, 0, 0]}>
              {[-4, 4].map((hx, i) => (
                <mesh key={i} position={[hx, 0.72, 0]} castShadow>
                  <boxGeometry args={[1.2, 0.06, 6.0]} />
                  <meshStandardMaterial map={woodTex} roughness={0.4} />
                </mesh>
              ))}
              <mesh position={[0, 0.72, -3.5]} castShadow>
                <boxGeometry args={[7.0, 0.06, 1.2]} />
                <meshStandardMaterial map={woodTex} roughness={0.4} />
              </mesh>
            </group>
          ) : (
            /* Floor 3: Digital Media & Computer Suite */
            <>
              {[-3.5, 3.5].map((cx, i) => (
                <group key={`pc-row-${i}`} position={[cx, 0, 0]}>
                  <mesh position={[0, 0.72, 0]} castShadow>
                    <boxGeometry args={[2.0, 0.06, 8.0]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.3} />
                  </mesh>
                  {[-2.5, 0, 2.5].map((mz, mIdx) => (
                    <group key={mIdx} position={[0, 1.05, mz]}>
                      <mesh castShadow>
                        <boxGeometry args={[0.08, 0.5, 0.8]} />
                        <meshStandardMaterial color="#1e293b" />
                      </mesh>
                      <mesh position={[0.05, 0, 0]}>
                        <boxGeometry args={[0.02, 0.44, 0.74]} />
                        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
                      </mesh>
                    </group>
                  ))}
                </group>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- E. SENIOR SECONDARY COLLEGIATE BLOCKS (bldg_g11, bldg_g12) --- */}
      {isSeniorSecondary && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Floor 0: Collegiate Grand Atrium */
            <group position={[0, 0, 0]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[2.5, 2.6, 1.2, 32]} />
                <meshStandardMaterial map={limestoneTex} roughness={0.3} />
              </mesh>
              <mesh position={[0, 1.8, 0]} ref={holoSphereRef}>
                <sphereGeometry args={[0.7, 24, 24]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  wireframe
                  emissive="#0284c7"
                  emissiveIntensity={1.5}
                />
              </mesh>
            </group>
          ) : currentFloor === 4 ? (
            /* Floor 4: Rooftop Skyline Study Terrace */
            <>
              {[-5, 0, 5].map((px, idx) => (
                <mesh key={idx} position={[px, 3.0, 0]}>
                  <boxGeometry args={[0.2, 6.0, 0.2]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))}
              <group position={[0, 0, 2]}>
                <mesh position={[0, 0.6, 0]}>
                  <cylinderGeometry args={[0.1, 0.2, 1.2, 8]} />
                  <meshStandardMaterial color="#334155" metalness={0.9} />
                </mesh>
                <mesh position={[0, 1.3, 0]} rotation={[0.4, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.15, 0.18, 1.4, 16]} />
                  <meshStandardMaterial color="#38bdf8" metalness={0.8} />
                </mesh>
              </group>
            </>
          ) : (
            /* Floors 1-3: Collegiate Seminar Amphitheater */
            <>
              {[1, 2].map((tier, tIdx) => (
                <mesh
                  key={tIdx}
                  position={[0, 0.25 * tier, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  receiveShadow
                >
                  <ringGeometry args={[3.0 + tier * 2.2, 4.8 + tier * 2.2, 32, 1, 0, Math.PI]} />
                  <meshStandardMaterial color="#1e293b" roughness={0.4} />
                </mesh>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- F. ARTS, MUSIC & CULTURAL CENTER (arts_center) --- */}
      {isArts && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Floor 0: Symphony & Instrumental Orchestra Hall */
            <>
              {/* Grand Concert Piano Model */}
              <group position={[0, 0, -1]}>
                <mesh position={[0, 0.8, 0]} castShadow>
                  <boxGeometry args={[2.8, 0.5, 2.2]} />
                  <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Piano Open Lid */}
                <mesh position={[0, 1.4, -0.2]} rotation={[0.35, 0, 0]} castShadow>
                  <boxGeometry args={[2.7, 0.08, 2.0]} />
                  <meshStandardMaterial color="#09090b" roughness={0.1} metalness={0.9} />
                </mesh>
                {/* Piano Legs */}
                {[-1.1, 1.1].map((px, i) => (
                  <mesh key={i} position={[px, 0.35, 0.8]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
                    <meshStandardMaterial color="#09090b" />
                  </mesh>
                ))}
              </group>

              {/* Music Stands with Sheet Music in Arc */}
              {[-3.5, -1.8, 1.8, 3.5].map((sx, idx) => (
                <group key={`stand-${idx}`} position={[sx, 0, 3]}>
                  <mesh position={[0, 0.65, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
                    <meshStandardMaterial color="#334155" metalness={0.9} />
                  </mesh>
                  <mesh position={[0, 1.3, 0]} rotation={[0.25, 0, 0]} castShadow>
                    <boxGeometry args={[0.6, 0.45, 0.02]} />
                    <meshStandardMaterial color="#f8fafc" />
                  </mesh>
                </group>
              ))}
            </>
          ) : (
            /* Floor 1: Visual Arts, Easels & Sculpture Studio */
            <>
              {/* Central Sculpture Pedestals */}
              {[-2, 2].map((px, i) => (
                <group key={`sculpture-${i}`} position={[px, 0, 0]}>
                  <mesh position={[0, 0.6, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.6, 1.2, 16]} />
                    <meshStandardMaterial map={limestoneTex} roughness={0.4} />
                  </mesh>
                  {/* Classical Marble Bust / Geometric Form */}
                  <mesh position={[0, 1.5, 0]} castShadow>
                    <dodecahedronGeometry args={[0.45, 0]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
                  </mesh>
                </group>
              ))}
              {/* Studio Easels with vibrant paintings */}
              {[-5, 5].map((ex, idx) => (
                <group key={`art-easel-${idx}`} position={[ex, 0, 2]}>
                  <mesh position={[0, 1.3, 0]} rotation={[0.15, 0, 0]} castShadow>
                    <boxGeometry args={[1.2, 1.4, 0.06]} />
                    <meshStandardMaterial
                      color={idx === 0 ? '#ec4899' : '#8b5cf6'}
                      roughness={0.6}
                    />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- G. GRAND AUDITORIUM & AMPHITHEATER (auditorium) --- */}
      {isAuditorium && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Floor 0: Tiered Theater Stalls & Proscenium Stage */
            <>
              {/* Grand Performance Stage */}
              <group position={[0, 0, -5]}>
                <mesh position={[0, 0.6, 0]} receiveShadow>
                  <boxGeometry args={[18, 1.2, 7]} />
                  <meshStandardMaterial map={woodTex} roughness={0.3} />
                </mesh>
                {/* Proscenium Arch & Deep Crimson Velvet Curtains */}
                <mesh position={[-7, 3.5, 2.5]} castShadow>
                  <boxGeometry args={[2.5, 5.0, 0.4]} />
                  <meshStandardMaterial color="#be123c" roughness={0.7} />
                </mesh>
                <mesh position={[7, 3.5, 2.5]} castShadow>
                  <boxGeometry args={[2.5, 5.0, 0.4]} />
                  <meshStandardMaterial color="#be123c" roughness={0.7} />
                </mesh>
                <mesh position={[0, 5.8, 2.5]}>
                  <boxGeometry args={[16.5, 0.8, 0.4]} />
                  <meshStandardMaterial color="#9f1239" roughness={0.7} />
                </mesh>
              </group>

              {/* Theater Stalls: Crimson Velvet Auditorium Seats */}
              {[-1, 2, 5].map((rowZ, rIdx) =>
                [-6, -3, 0, 3, 6].map((colX, cIdx) => (
                  <group key={`aud-seat-${rIdx}-${cIdx}`} position={[colX, 0.2 * rIdx, rowZ]}>
                    <mesh position={[0, 0.45, 0]} castShadow>
                      <boxGeometry args={[0.7, 0.12, 0.65]} />
                      <meshStandardMaterial color="#9f1239" roughness={0.7} />
                    </mesh>
                    <mesh position={[0, 0.85, 0.3]} rotation={[-0.1, 0, 0]} castShadow>
                      <boxGeometry args={[0.7, 0.7, 0.12]} />
                      <meshStandardMaterial color="#9f1239" roughness={0.7} />
                    </mesh>
                  </group>
                ))
              )}

              {/* Stage Spotlight */}
              <group ref={stageSpotlightRef} position={[0, 5.5, 2]}>
                <spotLight
                  position={[0, 0, 0]}
                  target-position={[0, 1, -5]}
                  angle={0.6}
                  penumbra={0.5}
                  intensity={3.5}
                  color="#fef08a"
                />
              </group>
            </>
          ) : (
            /* Floor 1: Balcony Dress Circle & AV Mixing Console */
            <>
              {/* AV Sound & Lighting Mixing Desk */}
              <group position={[0, 0, 1]}>
                <mesh position={[0, 0.85, 0]} castShadow>
                  <boxGeometry args={[4.2, 0.1, 1.8]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                {/* Mixing Monitors */}
                {[-1.2, 0, 1.2].map((mx, idx) => (
                  <mesh key={idx} position={[mx, 1.2, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.5, 0.08]} />
                    <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.2} />
                  </mesh>
                ))}
              </group>
              {/* Balcony Overlook Railing */}
              <mesh position={[0, 0.5, -4]}>
                <boxGeometry args={[18, 1.0, 0.15]} />
                <meshStandardMaterial color="#fbbf24" metalness={0.9} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* --- H. CENTRAL WONDER LIBRARY (library) --- */}
      {isLibrary && (
        <group position={[0, 0, 0]}>
          {[-7, -3.5, 3.5, 7].map((bx, idx) => (
            <group key={`lib-shelf-${idx}`} position={[bx, 0, -2]}>
              <mesh position={[0, 2.4, 0]} castShadow>
                <boxGeometry args={[1.2, 4.8, 7.5]} />
                <meshStandardMaterial map={woodTex} roughness={0.4} />
              </mesh>
              {[0.8, 1.8, 2.8, 3.8].map((by, sIdx) => (
                <group key={sIdx}>
                  <mesh position={[0.62, by, 0]}>
                    <boxGeometry args={[0.08, 0.65, 7.2]} />
                    <meshStandardMaterial
                      color={sIdx % 2 === 0 ? '#b91c1c' : '#0369a1'}
                      roughness={0.8}
                    />
                  </mesh>
                  <mesh position={[-0.62, by, 0]}>
                    <boxGeometry args={[0.08, 0.65, 7.2]} />
                    <meshStandardMaterial
                      color={sIdx % 2 === 0 ? '#15803d' : '#d97706'}
                      roughness={0.8}
                    />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
          <group position={[0, 0, 3]}>
            <mesh position={[0, 0.75, 0]} castShadow>
              <boxGeometry args={[4.5, 0.08, 2.0]} />
              <meshStandardMaterial map={woodTex} roughness={0.3} />
            </mesh>
            {[-1.5, 0, 1.5].map((lx, lIdx) => (
              <mesh key={lIdx} position={[lx, 1.05, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.25, 0.15, 16]} />
                <meshStandardMaterial color="#15803d" emissive="#166534" emissiveIntensity={0.8} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* --- I. UNIFIED SCIENCE COMPLEX (science_complex) --- */}
      {isScience && (
        <group position={[0, 0, 0]}>
          <group position={[0, 0, 0]}>
            <mesh position={[0, 0.3, 0]} receiveShadow>
              <cylinderGeometry args={[3.2, 3.4, 0.6, 24]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[3.0, 3.0, 0.08, 24]} />
              <meshStandardMaterial color="#3f2e18" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.25, 2.4, 12]} />
              <meshStandardMaterial color="#5c3817" />
            </mesh>
            <mesh position={[0, 3.2, 0]} castShadow>
              <sphereGeometry args={[1.4, 16, 16]} />
              <meshStandardMaterial color="#10b981" roughness={0.7} />
            </mesh>
          </group>
        </group>
      )}

      {/* --- J. TECHNOLOGY & AI INNOVATION CENTER (tech_hub) --- */}
      {isTech && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <ringGeometry args={[3.5, 4.2, 32]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
          </mesh>
          <group ref={robotArmRef} position={[0, 0, 0]}>
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.5, 0.8, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            <mesh position={[0, 1.2, 0.3]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.18, 1.2, 0.18]} />
              <meshStandardMaterial color="#eab308" metalness={0.8} />
            </mesh>
            <mesh position={[0, 1.8, 0.7]} rotation={[-0.6, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.9, 0.14]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* --- K. STUDENT COMMONS & CAFETERIA (cafeteria_commons) --- */}
      {isCafeteria && (
        <group position={[0, 0, 0]}>
          <group position={[0, 0, -4]}>
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[14, 1.2, 1.4]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.22, 0]}>
              <boxGeometry args={[13.6, 0.05, 1.2]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.1} />
            </mesh>
          </group>
          {[-5, 0, 5].map((dx, i) => (
            <group key={`cafe-table-${i}`} position={[dx, 0, 3]}>
              <mesh position={[0, 0.75, 0]} castShadow>
                <boxGeometry args={[2.4, 0.08, 1.4]} />
                <meshStandardMaterial map={woodTex} roughness={0.3} />
              </mesh>
              {[-1.1, 1.1].map((bz, bIdx) => (
                <mesh key={bIdx} position={[0, 0.45, bz]} castShadow>
                  <boxGeometry args={[2.2, 0.08, 0.45]} />
                  <meshStandardMaterial color="#f59e0b" roughness={0.5} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )}

      {/* --- L. HEALTH CLINIC & ADMINISTRATION (administration_health) --- */}
      {isAdminClinic && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            <>
              {[-4, 4].map((bx, idx) => (
                <group key={`med-bed-${idx}`} position={[bx, 0, -1]}>
                  <mesh position={[0, 0.65, 0]} castShadow>
                    <boxGeometry args={[1.4, 0.35, 2.6]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.25, 0]}>
                    <boxGeometry args={[1.45, 0.45, 2.65]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.9} />
                  </mesh>
                  <mesh position={[0, 0.88, -0.9]} castShadow>
                    <boxGeometry args={[1.0, 0.15, 0.5]} />
                    <meshStandardMaterial color="#e0f2fe" />
                  </mesh>
                </group>
              ))}
              <group position={[11.5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[2.0, 2.8, 0.6]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.4} />
                </mesh>
                <mesh position={[0, 0, 0.32]}>
                  <boxGeometry args={[0.3, 1.2, 0.02]} />
                  <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.2} />
                </mesh>
                <mesh position={[0, 0, 0.32]}>
                  <boxGeometry args={[1.2, 0.3, 0.02]} />
                  <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.2} />
                </mesh>
              </group>
            </>
          ) : (
            <>
              <mesh position={[0, 0.75, -2]} castShadow>
                <boxGeometry args={[3.8, 0.1, 1.8]} />
                <meshStandardMaterial color="#78350f" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.9, -3.2]} castShadow>
                <boxGeometry args={[0.8, 1.4, 0.15]} />
                <meshStandardMaterial color="#0f172a" roughness={0.4} />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* --- M. MAIN RECEPTION (reception) --- */}
      {isReception && (
        <group position={[0, 0, 0]}>
          {currentFloor === 0 ? (
            /* Modern Curved Reception Desk & Holographic 3D Campus Model */
            <>
              <group position={[0, 0, -2]}>
                <mesh position={[0, 0.6, 0]} castShadow>
                  <cylinderGeometry args={[2.8, 3.0, 1.2, 32, 1, false, 0, Math.PI]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.8} />
                </mesh>
                <mesh position={[0, 1.22, 0]}>
                  <cylinderGeometry args={[2.9, 3.1, 0.06, 32, 1, false, 0, Math.PI]} />
                  <meshStandardMaterial color="#f8fafc" />
                </mesh>
              </group>
              {/* Central Floating Hologram Sphere */}
              <group position={[0, 1.8, 2]}>
                <mesh ref={holoSphereRef}>
                  <sphereGeometry args={[0.9, 24, 24]} />
                  <meshStandardMaterial
                    color="#8b5cf6"
                    wireframe
                    emissive="#7c3aed"
                    emissiveIntensity={1.8}
                  />
                </mesh>
              </group>
            </>
          ) : (
            /* Admissions Advisory Gallery */
            <>
              {[-4, 4].map((lx, idx) => (
                <group key={idx} position={[lx, 0, 0]}>
                  <mesh position={[0, 0.75, 0]} castShadow>
                    <boxGeometry args={[2.4, 0.08, 1.4]} />
                    <meshStandardMaterial map={woodTex} />
                  </mesh>
                </group>
              ))}
            </>
          )}
        </group>
      )}

      {/* --- N. SPORTS COMPLEX (sports_complex) --- */}
      {isSports && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <circleGeometry args={[2.5, 32]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
          <group position={[0, 4.0, -10.5]}>
            <mesh castShadow>
              <boxGeometry args={[2.4, 1.6, 0.1]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.5, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.45, 0.03, 8, 24]} />
              <meshStandardMaterial color="#ea580c" metalness={0.8} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
