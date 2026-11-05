import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ6SlopFilter() {
  const filterRingRef = useRef<THREE.Group>(null);
  const slopGroupRef = useRef<THREE.Group>(null);
  const crystalGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Laser filter ring in the center
    if (filterRingRef.current) {
      filterRingRef.current.rotation.z = t * 1.5;
      const ringScale = 1 + Math.sin(t * 4) * 0.05;
      filterRingRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    // Dull chaotic slop objects on left (-X)
    if (slopGroupRef.current) {
      slopGroupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * (0.5 + i * 0.2);
        child.rotation.y = t * (0.8 + i * 0.1);
        child.position.y = Math.sin(t * 1.5 + i) * 0.3;
      });
    }

    // Clean pure crystalline geometries on right (+X)
    if (crystalGroupRef.current) {
      crystalGroupRef.current.children.forEach((child, i) => {
        child.rotation.y = t * 1.2 + i;
        child.rotation.z = t * 0.8 + i;
        child.position.y = Math.sin(t * 2 + i) * 0.25;
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 3]} intensity={2.8} color="#06b6d4" />
      <pointLight position={[3, 2, 2]} intensity={2} color="#fbbf24" />
      <pointLight position={[-3, 2, 2]} intensity={1} color="#64748b" />

      <Sparkles count={45} scale={6} size={2.5} speed={0.5} color="#06b6d4" />

      {/* Center Laser Filtering Ring */}
      <group ref={filterRingRef} position={[0, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 64]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>

        {/* Laser Scanning Grid Lines */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.2, 1.45, 16]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      </group>

      {/* LEFT: Dull Chaotic AI Slop (Grey, irregular torus knots) */}
      <group ref={slopGroupRef}>
        <mesh position={[-1.7, 0.5, 0]}>
          <torusKnotGeometry args={[0.38, 0.12, 48, 8, 2, 3]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[-2.2, -0.6, -0.3]}>
          <torusKnotGeometry args={[0.3, 0.09, 40, 8, 3, 4]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.95}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* RIGHT: High-Value Pure Knowledge Crystals (Golden / Cyan Gems) */}
      <group ref={crystalGroupRef}>
        <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
          <mesh position={[1.7, 0.5, 0]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </Float>
        <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.5}>
          <mesh position={[2.2, -0.6, -0.2]}>
            <icosahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0284c7"
              emissiveIntensity={1.4}
              roughness={0.1}
              metalness={0.85}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

