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

    if (filterRingRef.current) {
      filterRingRef.current.rotation.z = t * 0.8;
      const ringScale = 1 + Math.sin(t * 3) * 0.03;
      filterRingRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    if (slopGroupRef.current) {
      slopGroupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * (0.3 + i * 0.1);
        child.rotation.y = t * (0.5 + i * 0.08);
        child.position.y = Math.sin(t * 1.2 + i) * 0.2;
      });
    }

    if (crystalGroupRef.current) {
      crystalGroupRef.current.children.forEach((child, i) => {
        child.rotation.y = t * 0.8 + i;
        child.rotation.z = t * 0.5 + i;
        child.position.y = Math.sin(t * 1.5 + i) * 0.18;
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 0, 3]} intensity={2.6} color="#2dd4bf" />
      <pointLight position={[3, 2, 2]} intensity={2} color="#f5d061" />
      <pointLight position={[-3, 2, 2]} intensity={1} color="#64748b" />

      <Sparkles count={35} scale={6} size={2} speed={0.4} color="#2dd4bf" opacity={0.35} />

      {/* Center Laser Filtering Holographic Aperture */}
      <group ref={filterRingRef} position={[0, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.4, 0.035, 16, 96]} />
          <meshStandardMaterial
            color="#2dd4bf"
            emissive="#0d9488"
            emissiveIntensity={2}
            roughness={0.1}
          />
        </mesh>

        {/* Laser Scanning Aperture Grid */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.2, 1.36, 24]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.2}
            wireframe
          />
        </mesh>
      </group>

      {/* LEFT: Dull Chaotic AI Slop (Matte charcoal, chaotic entanglement) */}
      <group ref={slopGroupRef}>
        <mesh position={[-1.6, 0.45, 0]}>
          <torusKnotGeometry args={[0.34, 0.1, 48, 8, 2, 3]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[-2.1, -0.5, -0.2]}>
          <torusKnotGeometry args={[0.26, 0.08, 40, 8, 3, 4]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.95}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* RIGHT: Pure Handcrafted Knowledge Crystals */}
      <group ref={crystalGroupRef}>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.4}>
          <mesh position={[1.6, 0.45, 0]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color="#f5d061"
              emissive="#d4a329"
              emissiveIntensity={1.1}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </Float>
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.4}>
          <mesh position={[2.1, -0.5, -0.15]}>
            <icosahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial
              color="#2dd4bf"
              emissive="#0d9488"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.85}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}
