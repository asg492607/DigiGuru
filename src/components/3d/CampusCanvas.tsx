import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { CampusGrounds } from './CampusGrounds';
import { BuildingInterior3D } from './BuildingInterior3D';
import { AITeacher3D } from './AITeacher3D';
import { Classmates3D } from './Classmates3D';
import { StudentAvatar } from './StudentAvatar';
import type { Classmate, LessonStep, TeacherState } from '../../types/campus';

interface CampusCanvasProps {
  playerPos: [number, number, number];
  onPlayerPosChange: (pos: [number, number, number]) => void;
  activeBuildingId: string | null;
  activeFloor: number;
  onEnterBuilding: (buildingId: string, floor?: number) => void;
  onChangeFloor: (floor: number) => void;
  onExitToCampus: () => void;
  onEnterZone: (zoneId: string) => void;
  classmates: Classmate[];
  onSelectClassmate: (classmate: Classmate) => void;
  currentStep?: LessonStep;
  teacherSpeaking: boolean;
  teacherGesture: 'welcome' | 'point_board' | 'summon_ar' | 'celebrate';
  teacherModel?: 'human' | 'robot';
  teacherState?: TeacherState;
  onTeacherArrival?: () => void;
  virtualJoystick: { x: number; y: number; active: boolean };
  clickTarget: [number, number, number] | null;
  onGroundClick: (coords: [number, number, number]) => void;
  onClearClickTarget: () => void;
  emote: 'none' | 'wave' | 'cheer' | 'sit';
}

export const CampusCanvas: React.FC<CampusCanvasProps> = ({
  playerPos,
  onPlayerPosChange,
  activeBuildingId,
  activeFloor,
  onEnterBuilding,
  onChangeFloor,
  onExitToCampus,
  onEnterZone,
  classmates,
  onSelectClassmate,
  currentStep,
  teacherSpeaking,
  teacherGesture,
  teacherModel = 'human',
  teacherState = 'teaching',
  onTeacherArrival,
  virtualJoystick,
  clickTarget,
  onGroundClick,
  onClearClickTarget,
  emote,
}) => {
  const isInside = activeBuildingId !== null;
  const isNurseryClassroom = activeBuildingId === 'bldg_nursery' && activeFloor === 0;

  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas
        shadows
        camera={{ position: [0, 8, 45], fov: 50, near: 0.1, far: 300 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          {/* Atmospheric Environment */}
          {!isInside ? (
            <>
              <Sky sunPosition={[100, 40, 100]} turbidity={8} rayleigh={2} mieCoefficient={0.005} />
              <fog attach="fog" args={['#bfdbfe', 40, 140]} />
            </>
          ) : (
            <color attach="background" args={['#0f172a']} />
          )}

          {/* Click-to-Walk Ground Raycaster Plane */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.01, 0]}
            visible={false}
            onPointerDown={(e) => {
              e.stopPropagation();
              onGroundClick([e.point.x, e.point.y, e.point.z]);
            }}
          >
            <planeGeometry args={[160, 160]} />
          </mesh>

          {/* Click-to-Walk Destination Ring Indicator */}
          {clickTarget && (
            <mesh
              position={[clickTarget[0], 0.04, clickTarget[2]]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.5, 0.7, 24]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} />
            </mesh>
          )}

          {/* Dynamic Illumination */}
          {!isInside ? (
            <>
              <ambientLight intensity={0.7} />
              <hemisphereLight groundColor="#1e293b" color="#bae6fd" intensity={0.5} />
              <directionalLight
                position={[40, 60, 30]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-near={10}
                shadow-camera-far={180}
                shadow-camera-left={-60}
                shadow-camera-right={60}
                shadow-camera-top={60}
                shadow-camera-bottom={-60}
                shadow-bias={-0.0005}
              />
            </>
          ) : (
            <>
              {/* Indoor Ambient & Spot Lighting */}
              <ambientLight intensity={0.9} color="#ffffff" />
              <pointLight position={[0, 6.0, 0]} intensity={2.2} distance={24} color="#f0f9ff" />
              <pointLight position={[0, 6.0, -8]} intensity={1.5} distance={18} color="#fffbeb" />
              <pointLight position={[0, 6.0, 8]} intensity={1.5} distance={18} color="#f0fdf4" />
            </>
          )}

          {/* EITHER OUTDOOR CAMPUS GROUNDS OR INDOOR BUILDING INTERIOR */}
          {!isInside ? (
            <CampusGrounds
              onEnterBuilding={onEnterBuilding}
              onEnterZone={onEnterZone}
              playerPos={playerPos}
            />
          ) : (
            <>
              {/* Master Building Interior with Stairs, Elevator & Themed Rooms */}
              <BuildingInterior3D
                buildingId={activeBuildingId!}
                currentFloor={activeFloor}
                onChangeFloor={onChangeFloor}
                onExitToCampus={onExitToCampus}
                playerPos={playerPos}
                currentStep={currentStep}
              />

              {/* AI Teacher Miss Maya (in Nursery Class or Faculty areas) */}
              {isNurseryClassroom && (
                <AITeacher3D
                  position={[0, 0, -2]}
                  isSpeaking={teacherSpeaking}
                  gestureMode={teacherGesture}
                  teacherModel={teacherModel}
                  teacherState={teacherState}
                  onArrivalAtPodium={onTeacherArrival}
                />
              )}
            </>
          )}

          {/* 3D Classmates */}
          <Classmates3D
            classmates={classmates}
            isInsideNursery={isInside}
            onSelectClassmate={onSelectClassmate}
          />

          {/* Player Student Avatar with Real Walking & Indoor/Outdoor Clamping */}
          <StudentAvatar
            position={playerPos}
            onPositionChange={onPlayerPosChange}
            isInsideBuilding={isInside}
            virtualJoystick={virtualJoystick}
            clickTarget={clickTarget}
            onClearClickTarget={onClearClickTarget}
            emote={emote}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
