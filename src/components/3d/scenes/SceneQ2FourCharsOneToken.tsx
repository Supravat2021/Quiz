import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ2FourCharsOneToken() {
  const groupRef = useRef<THREE.Group>(null);
  const dodecahedronRef = useRef<THREE.Mesh>(null);
  const spheresRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = -t * 0.4;
      haloRef.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.5) * 0.1;
    }

    // Breathing harmonic merge cycle: 0 = merged, 1 = expanded
    const cycle = (Math.sin(t * 1.4) + 1) / 2;
    const radius = 0.45 + cycle * 1.4;

    if (spheresRef.current) {
      spheresRef.current.children.forEach((sphere, index) => {
        const baseAngle = (index * Math.PI) / 2;
        const angle = baseAngle + t * 1.1;
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.y = Math.sin(t * 2 + index) * 0.25;
        sphere.position.z = Math.sin(angle) * radius;

        const s = 0.18 + cycle * 0.12;
        sphere.scale.set(s, s, s);

        const mat = (sphere as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = 0.4 + cycle * 0.6;
        }
      });
    }

    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x = t * 0.6;
      dodecahedronRef.current.rotation.y = t * 0.8;

      const mergeFactor = 1 - cycle;
      const targetScale = 0.75 + mergeFactor * 0.3;
      dodecahedronRef.current.scale.set(targetScale, targetScale, targetScale);

      const mat = dodecahedronRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.8 + mergeFactor * 1.4;
      }
    }
  });

  const sphereColors = ['#2dd4bf', '#38bdf8', '#f5d061', '#fb7185'];

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 3]} intensity={2.5} color="#f5d061" />
      <pointLight position={[-3, -2, 2]} intensity={2} color="#2dd4bf" />

      <Sparkles count={35} scale={5} size={2} speed={0.4} color="#f5d061" opacity={0.35} />

      {/* Central Golden Token Dodecahedron */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh ref={dodecahedronRef} position={[0, 0, 0]}>
          <dodecahedronGeometry args={[0.78, 0]} />
          <meshStandardMaterial
            color="#f5d061"
            emissive="#d97706"
            emissiveIntensity={0.9}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
      </Float>

      {/* Delicate Concentric Orbit Ring */}
      <mesh ref={haloRef}>
        <torusGeometry args={[1.65, 0.015, 16, 96]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.8}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* 4 Orbiting Harmonic Spheres (4 Characters) */}
      <group ref={spheresRef}>
        {sphereColors.map((col, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={1.3}
              roughness={0.1}
              metalness={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
