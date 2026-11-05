import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ2FourCharsOneToken() {
  const groupRef = useRef<THREE.Group>(null);
  const dodecahedronRef = useRef<THREE.Mesh>(null);
  const spheresRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3;
    }

    // Merging cycle: expands outwards then compresses into dodecahedron
    const cycle = (Math.sin(t * 1.8) + 1) / 2; // 0 to 1
    const radius = 0.5 + cycle * 1.5; // distance from center

    if (spheresRef.current) {
      spheresRef.current.children.forEach((sphere, index) => {
        const angle = (index * Math.PI) / 2 + t * 1.5;
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.y = Math.sin(t * 2 + index) * 0.3;
        sphere.position.z = Math.sin(angle) * radius;

        // Shrink when close to core
        const s = 0.2 + cycle * 0.15;
        sphere.scale.set(s, s, s);
      });
    }

    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x = t * 0.9;
      dodecahedronRef.current.rotation.y = t * 1.2;

      // Pulse larger when characters merge in (cycle near 0)
      const mergeFactor = 1 - cycle;
      const targetScale = 0.75 + mergeFactor * 0.35;
      dodecahedronRef.current.scale.set(targetScale, targetScale, targetScale);

      const mat = dodecahedronRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.8 + mergeFactor * 1.2;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 3]} intensity={2.2} color="#fbbf24" />
      <pointLight position={[-3, -2, 2]} intensity={2} color="#06b6d4" />

      <Sparkles count={40} scale={5} size={3} speed={0.5} color="#38bdf8" />

      {/* Central Solid Golden Dodecahedron (1 Token) */}
      <mesh ref={dodecahedronRef} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Orbiting Golden Ring around Dodecahedron */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.4, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 4 Orbiting Characters Spheres */}
      <group ref={spheresRef}>
        {['#06b6d4', '#38bdf8', '#fbbf24', '#f43f5e'].map((col, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

