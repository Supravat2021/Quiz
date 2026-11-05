import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ10FaceIDScan() {
  const headGroupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Group>(null);
  const phoneFrameRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Subtle head tracking turn
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.25;
      headGroupRef.current.rotation.x = Math.sin(t * 0.5) * 0.08;
    }

    // Laser scan line sweeping smoothly up and down from y = -1.2 to y = 1.2
    if (scanLineRef.current) {
      const scanY = Math.sin(t * 2.2) * 1.15;
      scanLineRef.current.position.y = scanY;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 3]} intensity={2.8} color="#06b6d4" />
      <pointLight position={[0, -2, 2]} intensity={2} color="#fbbf24" />

      <Sparkles count={40} scale={5} size={2.5} speed={0.5} color="#06b6d4" />

      {/* Outer Smartphone Glass Frame */}
      <group ref={phoneFrameRef} position={[0, 0, -0.2]}>
        {/* Phone chassis */}
        <mesh>
          <boxGeometry args={[1.9, 3.2, 0.08]} />
          <meshStandardMaterial
            color="#0b132b"
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.3}
          />
        </mesh>
        {/* Phone perimeter outline */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.9, 3.2, 0.08)]} />
          <lineBasicMaterial color="#38bdf8" />
        </lineSegments>
      </group>

      {/* Procedural 3D Geometric Wireframe Face / Head Mask */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={headGroupRef} position={[0, 0, 0.1]}>
          {/* Main Skull / Cranium (Icosahedron high-poly wireframe) */}
          <mesh position={[0, 0.2, 0]}>
            <icosahedronGeometry args={[0.7, 2]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0284c7"
              emissiveIntensity={0.7}
              wireframe
            />
          </mesh>

          {/* Chin / Jaw Geometry */}
          <mesh position={[0, -0.45, 0.15]}>
            <coneGeometry args={[0.42, 0.6, 6]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0369a1"
              emissiveIntensity={0.8}
              wireframe
            />
          </mesh>

          {/* Eye landmarks (Key biometric recognition dots) */}
          <mesh position={[-0.24, 0.22, 0.6]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.24, 0.22, 0.6]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </mesh>

          {/* Nose bridge landmark */}
          <mesh position={[0, 0.05, 0.68]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.8} />
          </mesh>

          {/* Mouth landmark */}
          <mesh position={[0, -0.22, 0.58]}>
            <boxGeometry args={[0.22, 0.04, 0.04]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.8} />
          </mesh>
        </group>
      </Float>

      {/* Vertical Sweeping Laser Scan Line & Glow Plane */}
      <group ref={scanLineRef}>
        {/* Bright horizontal laser beam */}
        <mesh position={[0, 0, 0.75]}>
          <boxGeometry args={[1.8, 0.035, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        {/* Laser glow fan */}
        <mesh position={[0, 0, 0.72]}>
          <planeGeometry args={[1.75, 0.18]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
