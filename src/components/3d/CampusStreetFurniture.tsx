import React from 'react';
import * as THREE from 'three';

// 3D Realistic School Bus Model
const SchoolBus3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Bus Chassis */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.5, 0.4, 7.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Main Yellow School Bus Cabin Body */}
      <mesh position={[0, 1.6, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[2.45, 2.0, 7.2]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Engine Hood Front */}
      <mesh position={[0, 1.1, 4.1]} castShadow>
        <boxGeometry args={[2.2, 1.0, 1.2]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Black Rub Rail Stripes */}
      <mesh position={[0, 1.25, 0.2]}>
        <boxGeometry args={[2.48, 0.08, 7.25]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[0, 0.85, 0.2]}>
        <boxGeometry args={[2.48, 0.08, 7.25]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Front Windshield Glass */}
      <mesh position={[0, 1.9, 3.82]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[2.2, 0.9, 0.06]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.8} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Side Passenger Windows */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((wz, i) => (
        <group key={`win-${i}`}>
          {/* Left Windows */}
          <mesh position={[-1.23, 1.9, wz]}>
            <boxGeometry args={[0.04, 0.7, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </mesh>
          {/* Right Windows */}
          <mesh position={[1.23, 1.9, wz]}>
            <boxGeometry args={[0.04, 0.7, 0.75]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Front Radiator Grille & Headlights */}
      <group position={[0, 1.0, 4.72]}>
        <mesh>
          <boxGeometry args={[1.4, 0.55, 0.04]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Headlights */}
        <mesh position={[-0.85, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.85, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.05, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={1.2} />
        </mesh>
        {/* Front Bumper */}
        <mesh position={[0, -0.4, 0.1]} castShadow>
          <boxGeometry args={[2.5, 0.35, 0.25]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
      </group>

      {/* Rear Bumper & Tail Lights */}
      <group position={[0, 0.6, -3.45]}>
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.35, 0.25]} />
          <meshStandardMaterial color="#020617" metalness={0.9} />
        </mesh>
        <mesh position={[-0.95, 0.4, 0.02]}>
          <boxGeometry args={[0.18, 0.35, 0.04]} />
          <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={1.0} />
        </mesh>
        <mesh position={[0.95, 0.4, 0.02]}>
          <boxGeometry args={[0.18, 0.35, 0.04]} />
          <meshStandardMaterial color="#dc2626" emissive="#b91c1c" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Destination Sign on Top */}
      <group position={[0, 2.72, 3.4]}>
        <mesh>
          <boxGeometry args={[1.8, 0.28, 0.08]} />
          <meshStandardMaterial color="#020617" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[1.6, 0.2, 0.02]} />
          <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 6 Rubber Wheels with Hubcaps */}
      {[
        [-1.24, 0.45, 2.4], [1.24, 0.45, 2.4],
        [-1.24, 0.45, -1.4], [1.24, 0.45, -1.4],
        [-1.24, 0.45, -2.4], [1.24, 0.45, -2.4],
      ].map(([wx, wy, wz], idx) => (
        <group key={`wheel-${idx}`} position={[wx, wy, wz]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.28, 18]} />
            <meshStandardMaterial color="#09090b" roughness={0.8} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.12 : -0.12, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 3D Directional Signpost
export const DirectionalSignpost3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  signs: { text: string; direction: 'left' | 'right' | 'ahead'; color?: string }[];
}> = ({ position, rotation = [0, 0, 0], signs }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.4, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      {/* Cast Iron Pole */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3.2, 12]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Decorative Finial Top */}
      <mesh position={[0, 3.45, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Directional Arrow Signs */}
      {signs.map((s, idx) => {
        const yOffset = 2.4 + idx * 0.35;
        const signRot = s.direction === 'left' ? 0.3 : s.direction === 'right' ? -0.3 : 0;
        return (
          <group key={idx} position={[0, yOffset, 0]} rotation={[0, signRot, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.5, 0.28, 0.04]} />
              <meshStandardMaterial color={s.color || '#065f46'} roughness={0.3} />
            </mesh>
            {/* White Border & Lettering Simulation */}
            <mesh position={[0, 0, 0.025]}>
              <boxGeometry args={[1.4, 0.22, 0.01]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 3D Recycling & Waste Management Station (3 Bins)
export const RecyclingStation3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Concrete Pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1.6, 0.1, 0.7]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* 3 Color Coded Bins: Blue (Paper), Green (Organic), Yellow (Plastic) */}
      {[
        { x: -0.5, color: '#2563eb' },
        { x: 0, color: '#16a34a' },
        { x: 0.5, color: '#eab308' },
      ].map((bin, i) => (
        <group key={i} position={[bin.x, 0.45, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.18, 0.8, 16]} />
            <meshStandardMaterial color={bin.color} roughness={0.4} />
          </mesh>
          {/* Swivel Lid */}
          <mesh position={[0, 0.45, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 3D Drinking Water Cooler Kiosk
export const WaterCoolerKiosk3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Shelter Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[2.0, 0.2, 1.4]} />
        <meshStandardMaterial color="#475569" roughness={0.5} />
      </mesh>
      {/* Stainless Steel Water Station Body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[1.4, 0.9, 0.6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* 3 Drinking Bubbler Taps */}
      {[-0.4, 0, 0.4].map((tx, idx) => (
        <group key={idx} position={[tx, 1.15, 0.1]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.08, 0.05]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.02, 0.08, 8]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* Blue Overhead Canopy */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[2.2, 0.1, 1.6]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
      {/* Steel Canopy Posts */}
      <mesh position={[-0.9, 1.25, 0.6]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.3, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
      <mesh position={[0.9, 1.25, 0.6]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 2.3, 8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} />
      </mesh>
    </group>
  );
};

// 3D Soccer Goalpost with Netting
export const SoccerGoalpost3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Crossbar */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[5.0, 0.12, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Left Post */}
      <mesh position={[-2.44, 1.2, 0]} castShadow>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Right Post */}
      <mesh position={[2.44, 1.2, 0]} castShadow>
        <boxGeometry args={[0.12, 2.4, 0.12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      {/* Depth Backbars */}
      <mesh position={[-2.44, 0.06, -1.0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 2.0]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[2.44, 0.06, -1.0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 2.0]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Netting back plane (semi-transparent) */}
      <mesh position={[0, 1.2, -1.8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4.9, 2.3]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
    </group>
  );
};

// 3D Basketball Hoop
export const BasketballHoop3D: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Steel Support Post */}
      <mesh position={[0, 2.0, -0.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 4.0, 12]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      {/* Angled Overhang */}
      <mesh position={[0, 3.8, -0.2]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
      {/* White Backboard */}
      <mesh position={[0, 3.8, 0.15]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.06]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Target Square */}
      <mesh position={[0, 3.7, 0.19]}>
        <boxGeometry args={[0.6, 0.45, 0.01]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Orange Rim */}
      <mesh position={[0, 3.4, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 24]} />
        <meshStandardMaterial color="#ea580c" metalness={0.8} />
      </mesh>
      {/* Net */}
      <mesh position={[0, 3.15, 0.55]}>
        <cylinderGeometry args={[0.28, 0.15, 0.5, 12, 1, true]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.65} wireframe side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Master Campus Street Furniture and Outdoor Amenities Component
export const CampusStreetFurniture: React.FC = () => {
  return (
    <group>
      {/* ============================================================== */}
      {/* SCHOOL BUS TERMINAL & ARRIVAL BAY (Outside South Main Gate) */}
      {/* ============================================================== */}
      {/* Asphalt Bus Loop Roadway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 58]} receiveShadow>
        <planeGeometry args={[60, 18]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Pedestrian Zebra Crossing in front of Security Gate */}
      <group position={[0, 0.012, 51]}>
        {[-4, -2.5, -1, 0.5, 2, 3.5].map((zx, idx) => (
          <mesh key={`zebra-${idx}`} position={[zx, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.8, 3.2]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* 2 Official DigiGuru School Buses parked at Bus Bay */}
      <SchoolBus3D position={[-12, 0, 58]} rotation={[0, Math.PI / 2, 0]} />
      <SchoolBus3D position={[12, 0, 58]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Bus Stop Passenger Shelter */}
      <group position={[0, 0, 64]}>
        {/* Shelter Roof */}
        <mesh position={[0, 3.0, 0]} castShadow>
          <boxGeometry args={[14, 0.2, 3.5]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        {/* Tempered Glass Back Wall */}
        <mesh position={[0, 1.5, 1.6]}>
          <boxGeometry args={[13.6, 2.8, 0.08]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} metalness={0.9} />
        </mesh>
        {/* Bus Stop Waiting Bench */}
        <mesh position={[0, 0.45, 0.8]} castShadow>
          <boxGeometry args={[10, 0.1, 0.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.5} />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* DIRECTIONAL CAMPUS WAYFINDING SIGNPOSTS */}
      {/* ============================================================== */}
      {/* Intersection 1: South Boulevard & Early Years Corner */}
      <DirectionalSignpost3D
        position={[-4.8, 0, 16]}
        signs={[
          { text: 'Early Years & Primary Wing ⬅️', direction: 'left', color: '#db2777' },
          { text: 'Chhatrapati Shivaji Quad ⬆️', direction: 'ahead', color: '#ea580c' },
        ]}
      />
      {/* Intersection 2: South Boulevard & Secondary/College Corner */}
      <DirectionalSignpost3D
        position={[4.8, 0, 16]}
        signs={[
          { text: '➡️ Secondary & College Wing', direction: 'right', color: '#2563eb' },
          { text: '⬇️ Grand Gates & Bus Terminal', direction: 'left', color: '#059669' },
        ]}
      />
      {/* Intersection 3: North Promenade & Library/Bio-Dome Corner */}
      <DirectionalSignpost3D
        position={[0, 0, -16]}
        signs={[
          { text: 'Central Wonder Library ⬆️', direction: 'ahead', color: '#0284c7' },
          { text: '⬅️ Athletic Stadium & Sports', direction: 'left', color: '#16a34a' },
          { text: '➡️ AI Tech Innovation Hub', direction: 'right', color: '#7c3aed' },
        ]}
      />

      {/* ============================================================== */}
      {/* RECYCLING & WASTE SORTING STATIONS */}
      {/* ============================================================== */}
      <RecyclingStation3D position={[-7.5, 0, 8]} rotation={[0, 0.4, 0]} />
      <RecyclingStation3D position={[7.5, 0, 8]} rotation={[0, -0.4, 0]} />
      <RecyclingStation3D position={[-7.5, 0, -8]} rotation={[0, 2.7, 0]} />
      <RecyclingStation3D position={[7.5, 0, -8]} rotation={[0, -2.7, 0]} />
      <RecyclingStation3D position={[-16, 0, 30]} />

      {/* ============================================================== */}
      {/* STAINLESS STEEL DRINKING WATER COOLER KIOSKS */}
      {/* ============================================================== */}
      <WaterCoolerKiosk3D position={[-14, 0, 24]} rotation={[0, Math.PI / 2, 0]} />
      <WaterCoolerKiosk3D position={[14, 0, 24]} rotation={[0, -Math.PI / 2, 0]} />
      <WaterCoolerKiosk3D position={[-36, 0, -2]} rotation={[0, Math.PI / 2, 0]} />

      {/* ============================================================== */}
      {/* REALISTIC ATHLETIC SPORTS COMPLEX ASSETS */}
      {/* ============================================================== */}
      {/* 2 White Soccer Goalposts at Athletic Stadium */}
      <SoccerGoalpost3D position={[-48, 0, -11]} rotation={[0, 0, 0]} />
      <SoccerGoalpost3D position={[-48, 0, 7]} rotation={[0, Math.PI, 0]} />

      {/* Basketball Court Area & Hoop */}
      <group position={[-38, 0, -18]}>
        {/* Court Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#047857" roughness={0.6} />
        </mesh>
        {/* Basketball Hoop */}
        <BasketballHoop3D position={[0, 0, -5.5]} rotation={[0, 0, 0]} />
      </group>
    </group>
  );
};
