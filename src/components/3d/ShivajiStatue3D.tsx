import React from 'react';
import * as THREE from 'three';

interface ShivajiStatue3DProps {
  position?: [number, number, number];
}

export const ShivajiStatue3D: React.FC<ShivajiStatue3DProps> = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* ============================================================== */}
      {/* CEREMONIAL PLAZA DAIS & CIRCULAR GARDEN */}
      {/* ============================================================== */}
      {/* Outer Raised Circular Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 0]} receiveShadow>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Plaza Border Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]}>
        <ringGeometry args={[6.1, 6.5, 48]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Circular Flowerbed with Saffron & Gold Marigolds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
        <ringGeometry args={[4.4, 5.8, 36]} />
        <meshStandardMaterial color="#ea580c" roughness={0.9} />
      </mesh>

      {/* ============================================================== */}
      {/* MULTI-TIER BLACK GRANITE PEDESTAL */}
      {/* ============================================================== */}
      {/* Tier 1 Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.7, 4.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Tier 2 Middle */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.6, 3.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Tier 3 Pedestal Column */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.4, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Golden Inscription Plaque (Facing South toward Main Gate) */}
      <mesh position={[0, 2.1, 1.32]}>
        <boxGeometry args={[2.2, 0.8, 0.04]} />
        <meshStandardMaterial color="#d97706" emissive="#b45309" emissiveIntensity={0.6} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Top Pedestal Bevel */}
      <mesh position={[0, 2.85, 0]} castShadow>
        <boxGeometry args={[2.8, 0.15, 2.8]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>

      {/* ============================================================== */}
      {/* CHHATRAPATI SHIVAJI MAHARAJ STATUE SCULPTURE */}
      {/* ============================================================== */}
      <group position={[0, 2.95, 0]}>
        {/* Bronze Patina Base Plate */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.1, 1.2, 0.1, 24]} />
          <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Traditional Royal Boots (Mojari) */}
        <mesh position={[-0.24, 0.22, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.25, 0.42]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
        <mesh position={[0.24, 0.22, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.25, 0.42]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>

        {/* Lower Draped Robes / Dhoti */}
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.72, 1.1, 20]} />
          <meshStandardMaterial color="#9a3412" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Royal Angarkha (Upper Robe) & Torso */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <boxGeometry args={[0.85, 0.95, 0.55]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Saffron Sash & Kamarbandh (Waistbelt) */}
        <mesh position={[0, 1.35, 0.02]}>
          <boxGeometry args={[0.9, 0.18, 0.58]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>

        {/* Pearl Kanthi Necklace & Royal Medallion */}
        <mesh position={[0, 1.95, 0.29]}>
          <torusGeometry args={[0.24, 0.03, 12, 24]} />
          <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.72, 0.29]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 2.3, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.25, 16]} />
          <meshStandardMaterial color="#b45309" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Regal Head & Face */}
        <mesh position={[0, 2.65, 0.04]} castShadow>
          <sphereGeometry args={[0.34, 24, 24]} />
          <meshStandardMaterial color="#92400e" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Royal Mustache & Beard Profile */}
        <mesh position={[0, 2.52, 0.32]}>
          <boxGeometry args={[0.32, 0.06, 0.1]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>
        <mesh position={[0, 2.38, 0.28]}>
          <coneGeometry args={[0.12, 0.18, 8]} />
          <meshStandardMaterial color="#1c1917" />
        </mesh>

        {/* CHHATRAPATI FETA / PAGDI TURBAN WITH JIRADTOP PLUME */}
        <group position={[0, 2.85, 0.02]}>
          {/* Turban Wrap Base */}
          <mesh castShadow>
            <cylinderGeometry args={[0.44, 0.42, 0.32, 24]} />
            <meshStandardMaterial color="#c2410c" roughness={0.5} />
          </mesh>
          {/* Turban Side Flare */}
          <mesh position={[0.28, 0.08, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.25, 0.3, 0.35]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
          {/* Golden Jiradtop Brooch */}
          <mesh position={[0, 0.12, 0.38]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Feather Plume (Kalgi) */}
          <mesh position={[0, 0.4, 0.36]} rotation={[-0.2, 0, 0]} castShadow>
            <coneGeometry args={[0.06, 0.45, 8]} />
            <meshStandardMaterial color="#fef08a" metalness={0.6} />
          </mesh>
        </group>

        {/* Left Arm: Resting hand firmly on Royal Talwar Hilt */}
        <group position={[-0.52, 1.9, 0]}>
          <mesh position={[-0.1, -0.22, 0.12]} rotation={[0.4, 0, 0.3]} castShadow>
            <cylinderGeometry args={[0.13, 0.11, 0.52, 12]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {/* Left Hand on Hilt */}
          <mesh position={[-0.18, -0.5, 0.28]} castShadow>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#92400e" metalness={0.5} />
          </mesh>
        </group>

        {/* Royal Talwar Sword (Sheathed with Golden Pommel) */}
        <group position={[-0.38, 1.25, 0.25]} rotation={[0.3, 0.1, -0.3]}>
          {/* Hilt & Pommel */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.28, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Crossguard */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.08]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Sheath (Scabbard) */}
          <mesh position={[0, -0.6, 0]} castShadow>
            <boxGeometry args={[0.08, 1.4, 0.04]} />
            <meshStandardMaterial color="#831843" metalness={0.4} roughness={0.4} />
          </mesh>
        </group>

        {/* Right Arm: Raised Forward in Royal Leadership / Blessing Gesture */}
        <group position={[0.52, 1.9, 0]}>
          <mesh position={[0.14, -0.15, 0.18]} rotation={[-0.4, 0, -0.4]} castShadow>
            <cylinderGeometry args={[0.13, 0.11, 0.52, 12]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {/* Open Hand of Courage & Wisdom */}
          <mesh position={[0.26, -0.3, 0.45]} castShadow>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#92400e" metalness={0.5} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* 4 SAFFRON FLAGS (BHAGWA ZENDA) ON BRASS FLAGPOLES */}
      {/* ============================================================== */}
      {[
        [-3.2, 0, 3.2],
        [3.2, 0, 3.2],
        [-3.2, 0, -3.2],
        [3.2, 0, -3.2],
      ].map(([fx, fy, fz], idx) => (
        <group key={`flag-${idx}`} position={[fx, fy, fz]}>
          {/* Brass Base */}
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 0.6, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>
          {/* Tall Pole */}
          <mesh position={[0, 3.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 6.8, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
          {/* Golden Finial */}
          <mesh position={[0, 7.1, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} />
          </mesh>
          {/* Triangular Saffron Flag (Double-pointed Maratha Zenda) */}
          <mesh position={[0.65, 6.4, 0]} rotation={[0, 0.1, 0]}>
            <planeGeometry args={[1.3, 1]} />
            <meshStandardMaterial color="#ea580c" side={THREE.DoubleSide} roughness={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
