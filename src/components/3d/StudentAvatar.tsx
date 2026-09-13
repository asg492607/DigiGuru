import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../utils/audio';

interface StudentAvatarProps {
  position: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
  isInsideNursery: boolean;
  virtualJoystick: { x: number; y: number; active: boolean };
  clickTarget: [number, number, number] | null;
  onClearClickTarget: () => void;
  emote: 'none' | 'wave' | 'cheer' | 'sit';
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  position,
  onPositionChange,
  isInsideNursery,
  virtualJoystick,
  clickTarget,
  onClearClickTarget,
  emote,
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headGroupRef = useRef<THREE.Group>(null);
  const eyesGroupRef = useRef<THREE.Group>(null);

  // Articulated Limbs
  const leftThighRef = useRef<THREE.Group>(null);
  const leftCalfRef = useRef<THREE.Group>(null);
  const rightThighRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);

  const leftShoulderRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  const { camera } = useThree();

  const playerPos = useRef<THREE.Vector3>(new THREE.Vector3(...position));
  const playerRot = useRef<number>(0);
  const velocityY = useRef<number>(0);
  const isJumping = useRef<boolean>(false);
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});

  // 360-degree Dynamic Camera Orbit & Zoom
  const camYaw = useRef<number>(0);
  const camPitch = useRef<number>(0.32);
  const camDist = useRef<number>(isInsideNursery ? 6.0 : 9.5);

  // Sync external position changes
  useEffect(() => {
    playerPos.current.set(position[0], position[1], position[2]);
  }, [position]);

  // Mouse Orbit Drag & Zoom Listeners
  useEffect(() => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Right-click or middle-click or with Shift/Alt
      if (e.button === 2 || e.button === 1 || e.shiftKey) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;

      camYaw.current -= dx * 0.006;
      camPitch.current = THREE.MathUtils.clamp(camPitch.current + dy * 0.005, 0.05, 1.15);
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      const minD = isInsideNursery ? 3.5 : 4.5;
      const maxD = isInsideNursery ? 8.5 : 18.0;
      camDist.current = THREE.MathUtils.clamp(camDist.current + e.deltaY * 0.005, minD, maxD);
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Prevent context menu when right-click orbiting camera
      e.preventDefault();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isInsideNursery]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed((prev) => ({ ...prev, [key]: true }));

      if (key === ' ' || key === 'space') {
        if (!isJumping.current) {
          isJumping.current = true;
          velocityY.current = 6.2;
          soundManager.playClick();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed((prev) => ({ ...prev, [key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const speed = 7.5;
    let moveX = 0;
    let moveZ = 0;

    if (keysPressed['w'] || keysPressed['arrowup']) moveZ -= 1;
    if (keysPressed['s'] || keysPressed['arrowdown']) moveZ += 1;
    if (keysPressed['a'] || keysPressed['arrowleft']) moveX -= 1;
    if (keysPressed['d'] || keysPressed['arrowright']) moveX += 1;

    if (virtualJoystick.active) {
      moveX += virtualJoystick.x;
      moveZ += virtualJoystick.y;
    }

    if (clickTarget) {
      const dx = clickTarget[0] - playerPos.current.x;
      const dz = clickTarget[2] - playerPos.current.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.4) {
        moveX = dx / dist;
        moveZ = dz / dist;
      } else {
        onClearClickTarget();
      }
    }

    const isMoving = Math.hypot(moveX, moveZ) > 0.05;

    if (isMoving) {
      const moveLen = Math.hypot(moveX, moveZ);
      const normX = moveX / moveLen;
      const normZ = moveZ / moveLen;

      playerPos.current.x += normX * speed * delta;
      playerPos.current.z += normZ * speed * delta;

      const targetAngle = Math.atan2(normX, normZ);
      let angleDiff = targetAngle - playerRot.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      playerRot.current += angleDiff * Math.min(1, delta * 12);
    }

    // Jumping physics
    if (isJumping.current) {
      playerPos.current.y += velocityY.current * delta;
      velocityY.current -= 18 * delta;

      if (playerPos.current.y <= 0) {
        playerPos.current.y = 0;
        velocityY.current = 0;
        isJumping.current = false;
      }
    }

    // Boundaries
    if (isInsideNursery) {
      playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -22 - 7.5, -22 + 7.5);
      playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, 5 - 6.5, 5 + 6.5);
    } else {
      playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -58, 58);
      playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -50, 52);
    }

    if (avatarRef.current) {
      avatarRef.current.position.copy(playerPos.current);
      avatarRef.current.rotation.y = playerRot.current;
    }

    // Lifelike Natural Human Walking Gait
    const time = performance.now() * 0.009;

    // Eye blinking animation
    if (eyesGroupRef.current) {
      const blink = Math.sin(time * 0.5) > 0.98 ? 0.1 : 1;
      eyesGroupRef.current.scale.y = blink;
    }

    if (isMoving && !isJumping.current) {
      // Natural leg stride with knee bend
      const stride = Math.sin(time) * 0.55;

      if (leftThighRef.current && leftCalfRef.current) {
        leftThighRef.current.rotation.x = stride;
        // Bends knee when moving backward
        leftCalfRef.current.rotation.x = stride > 0 ? Math.max(0, stride * 0.7) : 0;
      }
      if (rightThighRef.current && rightCalfRef.current) {
        rightThighRef.current.rotation.x = -stride;
        rightCalfRef.current.rotation.x = -stride > 0 ? Math.max(0, -stride * 0.7) : 0;
      }

      // Natural arm counter-swing with bent elbow
      if (leftShoulderRef.current && leftForearmRef.current) {
        leftShoulderRef.current.rotation.x = -stride * 0.65;
        leftForearmRef.current.rotation.x = -0.3 + Math.abs(stride * 0.3);
      }
      if (rightShoulderRef.current && rightForearmRef.current) {
        rightShoulderRef.current.rotation.x = stride * 0.65;
        rightForearmRef.current.rotation.x = -0.3 + Math.abs(stride * 0.3);
      }

      // Subtle natural hip & head bounce
      if (headGroupRef.current) {
        headGroupRef.current.position.y = 1.62 + Math.abs(Math.sin(time * 2)) * 0.03;
      }
    } else if (!isJumping.current) {
      // Idle reset
      if (leftThighRef.current) leftThighRef.current.rotation.set(0, 0, 0);
      if (leftCalfRef.current) leftCalfRef.current.rotation.set(0, 0, 0);
      if (rightThighRef.current) rightThighRef.current.rotation.set(0, 0, 0);
      if (rightCalfRef.current) rightCalfRef.current.rotation.set(0, 0, 0);

      if (headGroupRef.current) headGroupRef.current.position.y = 1.62;

      // Emotes
      if (emote === 'wave' && rightShoulderRef.current && rightForearmRef.current) {
        rightShoulderRef.current.rotation.z = -1.6;
        rightShoulderRef.current.rotation.x = 0;
        rightForearmRef.current.rotation.z = Math.sin(time * 6) * 0.4;
      } else if (emote === 'cheer' && leftShoulderRef.current && rightShoulderRef.current) {
        leftShoulderRef.current.rotation.z = 2.4 + Math.sin(time * 4) * 0.15;
        rightShoulderRef.current.rotation.z = -2.4 - Math.sin(time * 4) * 0.15;
      } else if (emote === 'sit' && leftThighRef.current && rightThighRef.current) {
        leftThighRef.current.rotation.x = 1.4;
        rightThighRef.current.rotation.x = 1.4;
        if (leftCalfRef.current) leftCalfRef.current.rotation.x = -1.4;
        if (rightCalfRef.current) rightCalfRef.current.rotation.x = -1.4;
      } else {
        if (leftShoulderRef.current) leftShoulderRef.current.rotation.set(0, 0, 0.08);
        if (leftForearmRef.current) leftForearmRef.current.rotation.set(-0.15, 0, 0);
        if (rightShoulderRef.current) rightShoulderRef.current.rotation.set(0, 0, -0.08);
        if (rightForearmRef.current) rightForearmRef.current.rotation.set(-0.15, 0, 0);
      }
    }

    if (isMoving || isJumping.current) {
      onPositionChange([playerPos.current.x, playerPos.current.y, playerPos.current.z]);
    }

    // Q and E keys to smoothly rotate camera
    if (keysPressed['q']) camYaw.current -= delta * 2.0;
    if (keysPressed['e']) camYaw.current += delta * 2.0;

    // Smooth spherical orbit follow camera
    const cx = Math.sin(camYaw.current) * Math.cos(camPitch.current) * camDist.current;
    const cy = Math.sin(camPitch.current) * camDist.current + 1.4;
    const cz = Math.cos(camYaw.current) * Math.cos(camPitch.current) * camDist.current;

    const targetCamPos = playerPos.current.clone().add(new THREE.Vector3(cx, cy, cz));

    if (isInsideNursery) {
      // Prevent camera from clipping through classroom walls and ceiling
      targetCamPos.x = THREE.MathUtils.clamp(targetCamPos.x, -28.5, -15.5);
      targetCamPos.y = THREE.MathUtils.clamp(targetCamPos.y, 1.2, 6.2);
      targetCamPos.z = THREE.MathUtils.clamp(targetCamPos.z, -1.5, 11.5);
    }

    camera.position.lerp(targetCamPos, Math.min(1, delta * 8));
    camera.lookAt(playerPos.current.x, playerPos.current.y + 1.25, playerPos.current.z);
  });

  return (
    <group ref={avatarRef}>
      {/* ============================================================== */}
      {/* REALISTIC HUMANOID HEAD & SCULPTED FACE */}
      {/* ============================================================== */}
      <group ref={headGroupRef} position={[0, 1.62, 0]}>
        {/* Sculpted Head/Face Base */}
        <mesh castShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
        {/* Jawline & Chin */}
        <mesh position={[0, -0.1, 0.04]} castShadow>
          <boxGeometry args={[0.18, 0.14, 0.18]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.22, 0, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>

        {/* Eyes Group (Blinking) */}
        <group ref={eyesGroupRef} position={[0, 0.02, 0.18]}>
          {/* Left Eye */}
          <group position={[-0.07, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            {/* Pupil & Iris */}
            <mesh position={[0, 0, 0.028]}>
              <circleGeometry args={[0.022, 16]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} />
            </mesh>
            {/* Eye Highlight */}
            <mesh position={[0.008, 0.008, 0.03]}>
              <circleGeometry args={[0.007, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.07, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.038, 16, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <circleGeometry args={[0.022, 16]} />
              <meshStandardMaterial color="#1e3a8a" roughness={0.1} />
            </mesh>
            <mesh position={[0.008, 0.008, 0.03]}>
              <circleGeometry args={[0.007, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.07, 0.08, 0.2]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>
        <mesh position={[0.07, 0.08, 0.2]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.012, 0.02]} />
          <meshStandardMaterial color="#451a03" />
        </mesh>

        {/* Warm Smiling Mouth */}
        <mesh position={[0, -0.09, 0.2]} rotation={[0, 0, Math.PI]}>
          <ringGeometry args={[0.04, 0.055, 16, 1, 0, Math.PI]} />
          <meshStandardMaterial color="#b91c1c" side={THREE.DoubleSide} />
        </mesh>

        {/* Layered Realistic Styled Hair */}
        <group position={[0, 0.08, -0.02]}>
          {/* Hair Base Dome */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.24, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
            <meshStandardMaterial color="#1c1917" roughness={0.8} />
          </mesh>
          {/* Layered Bangs & Fringe */}
          <mesh position={[0, 0.12, 0.16]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.26, 0.08, 0.08]} />
            <meshStandardMaterial color="#292524" roughness={0.8} />
          </mesh>
          <mesh position={[-0.12, 0.04, 0.12]} rotation={[0.2, 0.2, -0.3]} castShadow>
            <boxGeometry args={[0.08, 0.14, 0.06]} />
            <meshStandardMaterial color="#1c1917" roughness={0.8} />
          </mesh>
          <mesh position={[0.12, 0.04, 0.12]} rotation={[0.2, -0.2, 0.3]} castShadow>
            <boxGeometry args={[0.08, 0.14, 0.06]} />
            <meshStandardMaterial color="#1c1917" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* TORSO: TAILORED SCHOOL BLAZER, COLLAR, TIE & BELT */}
      {/* ============================================================== */}
      <group position={[0, 1.05, 0]}>
        {/* Neck */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.14, 12]} />
          <meshStandardMaterial color="#fcd34d" roughness={0.6} />
        </mesh>

        {/* Dress Shirt Collar */}
        <mesh position={[0, 0.38, 0.02]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.08, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>

        {/* School Tie */}
        <mesh position={[0, 0.2, 0.14]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.06, 0.28, 0.02]} />
          <meshStandardMaterial color="#e11d48" roughness={0.5} />
        </mesh>

        {/* Tailored School Blazer / Jacket */}
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.54, 0.26]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} metalness={0.1} />
        </mesh>

        {/* Lapels */}
        <mesh position={[-0.1, 0.24, 0.14]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.24, 0.02]} />
          <meshStandardMaterial color="#172554" />
        </mesh>
        <mesh position={[0.1, 0.24, 0.14]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.24, 0.02]} />
          <meshStandardMaterial color="#172554" />
        </mesh>

        {/* DigiGuru School Crest on Chest Pocket */}
        <mesh position={[-0.12, 0.22, 0.14]}>
          <boxGeometry args={[0.07, 0.08, 0.02]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>

        {/* Leather Belt with Metallic Buckle */}
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.42, 0.06, 0.25]} />
          <meshStandardMaterial color="#1c1917" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.16, 0.13]}>
          <boxGeometry args={[0.08, 0.06, 0.02]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* ============================================================ */}
        {/* REALISTIC STUDENT BACKPACK WITH DUAL STRAPS & ZIPPERS */}
        {/* ============================================================ */}
        <group position={[0, 0.12, -0.18]}>
          {/* Main Bag Body */}
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.44, 0.16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.6} />
          </mesh>
          {/* Front Pocket */}
          <mesh position={[0, -0.06, -0.08]} castShadow>
            <boxGeometry args={[0.28, 0.22, 0.08]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} />
          </mesh>
          {/* Metallic Zipper Line */}
          <mesh position={[0, 0.06, -0.12]}>
            <boxGeometry args={[0.24, 0.015, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          {/* Side Water Bottle */}
          <mesh position={[0.19, -0.05, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.2, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* ARTICULATED ARMS (SHOULDERS, FOREARMS, HANDS WITH FINGERS) */}
      {/* ============================================================== */}
      {/* Left Arm */}
      <group ref={leftShoulderRef} position={[-0.26, 1.3, 0]}>
        {/* Shoulder pad */}
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        {/* Forearm & Hand */}
        <group ref={leftForearmRef} position={[0, -0.3, 0]}>
          {/* Forearm sleeve */}
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.26, 12]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.28, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightShoulderRef} position={[0.26, 1.3, 0]}>
        <mesh position={[0, -0.14, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.32, 12]} />
          <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
        </mesh>
        <group ref={rightForearmRef} position={[0, -0.3, 0]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <cylinderGeometry args={[0.065, 0.055, 0.26, 12]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.28, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fcd34d" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ============================================================== */}
      {/* ARTICULATED LEGS & SNEAKERS (THIGH, KNEE, CALF, SHOE) */}
      {/* ============================================================== */}
      {/* Left Leg */}
      <group ref={leftThighRef} position={[-0.12, 0.85, 0]}>
        {/* Upper Trouser */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.42, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        {/* Knee Joint & Calf */}
        <group ref={leftCalfRef} position={[0, -0.42, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          {/* Realistic Sneaker */}
          <group position={[0, -0.38, 0.06]}>
            {/* White Rubber Outsole */}
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.13, 0.04, 0.26]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            {/* Sneaker Upper */}
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.12, 0.08, 0.24]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
            {/* White Laces */}
            <mesh position={[0, 0.065, 0.02]}>
              <boxGeometry args={[0.06, 0.015, 0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightThighRef} position={[0.12, 0.85, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.42, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <group ref={rightCalfRef} position={[0, -0.42, 0]}>
          <mesh position={[0, -0.18, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.07, 0.38, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          <group position={[0, -0.38, 0.06]}>
            <mesh position={[0, -0.04, 0]}>
              <boxGeometry args={[0.13, 0.04, 0.26]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.02, 0]} castShadow>
              <boxGeometry args={[0.12, 0.08, 0.24]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.065, 0.02]}>
              <boxGeometry args={[0.06, 0.015, 0.08]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Floating Student Name Tag Banner */}
      <mesh position={[0, 2.2, 0]}>
        <planeGeometry args={[1.5, 0.36]} />
        <meshStandardMaterial
          color="#1e1b4b"
          emissive="#312e81"
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
