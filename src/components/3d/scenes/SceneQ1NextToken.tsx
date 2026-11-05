import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ1NextToken() {
  const coreRef = useRef<THREE.Group>(null);
  const streamRef = useRef<THREE.Group>(null);
  const projectedCubeRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
      const breathing = 1 + Math.sin(t * 2.5) * 0.05;
      coreRef.current.scale.set(breathing, breathing, breathing);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.1;
    }

    if (streamRef.current) {
      streamRef.current.children.forEach((child, i) => {
        // Stream of tokens flowing towards core along a smooth sine wave
        const progress = ((t * 0.8 + i * 0.6) % 3.6);
        const x = -3.2 + progress;
        child.position.x = x;
        child.position.y = Math.sin(x * 2.2 + t) * 0.25;
        child.position.z = Math.cos(x * 1.8 + t) * 0.25;
        child.rotation.x = t + i;
        child.rotation.y = t * 1.2 + i;

        // Soft fade out as it enters the core
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          const distToCenter = Math.abs(x);
          mat.opacity = Math.min(0.9, distToCenter * 0.6);
        }
      });
    }

    if (projectedCubeRef.current) {
      // Golden predicted token gliding outward
      const cycle = (t * 0.9) % 2.8;
      projectedCubeRef.current.position.x = 0.5 + cycle * 1.0;
      projectedCubeRef.current.position.y = Math.sin(t * 2) * 0.1;
      projectedCubeRef.current.position.z = Math.cos(t * 1.5) * 0.1;
      projectedCubeRef.current.rotation.y = t * 1.8;
      projectedCubeRef.current.rotation.z = t * 1.2;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 1, 3]} intensity={2.8} color="#f5d061" />
      <pointLight position={[-4, 2, 2]} intensity={2.2} color="#2dd4bf" />
      <pointLight position={[4, -2, 2]} intensity={1.8} color="#38bdf8" />

      <Sparkles count={35} scale={6} size={2} speed={0.3} color="#f5d061" opacity={0.4} />

      {/* Inward Ingestion Stream (Context Tokens) */}
      <group ref={streamRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[-2 - i * 0.6, 0, 0]}>
            <boxGeometry args={[0.26, 0.26, 0.26]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive="#14b8a6"
              emissiveIntensity={0.6}
              roughness={0.15}
              metalness={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>

      {/* Central Pulsing Neural Core */}
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Inner radiant seed */}
        <mesh>
          <sphereGeometry args={[0.52, 32, 32]} />
          <meshStandardMaterial
            color="#f5d061"
            emissive="#d97706"
            emissiveIntensity={1.4}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Outer crystalline icosahedron lattice */}
        <mesh>
          <icosahedronGeometry args={[0.82, 1]} />
          <meshStandardMaterial
            color="#2dd4bf"
            emissive="#0d9488"
            emissiveIntensity={0.5}
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Delicate golden orbital halo */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.15, 0.018, 16, 80]} />
          <meshStandardMaterial
            color="#f5d061"
            emissive="#f5d061"
            emissiveIntensity={1.2}
            transparent
            opacity={0.75}
          />
        </mesh>
      </group>

      {/* Predicted Golden Token (Floating with trailing aura) */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.4}>
        <group ref={projectedCubeRef} position={[1.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.52, 0.52, 0.52]} />
            <meshStandardMaterial
              color="#f5d061"
              emissive="#d4a329"
              emissiveIntensity={1.6}
              roughness={0.15}
              metalness={0.85}
              transparent
              opacity={0.92}
            />
          </mesh>
          {/* Inner floating core */}
          <mesh>
            <octahedronGeometry args={[0.22, 0]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>
        </group>
      </Float>
    </group>
  );
}
