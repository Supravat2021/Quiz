import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ1NextToken() {
  const coreRef = useRef<THREE.Group>(null);
  const streamRef = useRef<THREE.Group>(null);
  const projectedCubeRef = useRef<THREE.Mesh>(null);

  // Animate core pulsing and token stream flow
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.8;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      const scale = 1 + Math.sin(t * 4) * 0.08;
      coreRef.current.scale.set(scale, scale, scale);
    }

    if (streamRef.current) {
      streamRef.current.children.forEach((child, i) => {
        // Stream cubes flowing inward from left (-3.5 to 0)
        const speed = 1.2;
        const offset = (i * 0.7 - t * speed) % 4;
        const xPos = -4 + offset;
        child.position.x = xPos;
        child.position.y = Math.sin(t * 2 + i) * 0.35;
        child.position.z = Math.cos(t * 2 + i) * 0.35;
        child.rotation.x = t + i;
        child.rotation.y = t * 1.5 + i;
      });
    }

    if (projectedCubeRef.current) {
      // Golden cube projected forward
      const cycle = (t * 1.4) % 2.5;
      projectedCubeRef.current.position.x = 0.6 + cycle * 1.2;
      projectedCubeRef.current.position.y = Math.sin(t * 3) * 0.15;
      projectedCubeRef.current.rotation.y = t * 2.5;
      projectedCubeRef.current.rotation.z = t * 1.8;
      const mat = projectedCubeRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = Math.max(0.1, 1 - cycle / 2.5);
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 3]} intensity={2.5} color="#fbbf24" />
      <pointLight position={[-4, 1, 2]} intensity={2} color="#06b6d4" />
      <pointLight position={[3, -1, 1]} intensity={1.8} color="#38bdf8" />

      {/* Background sparkles */}
      <Sparkles count={45} scale={6} size={2.5} speed={0.4} color="#fbbf24" />

      {/* Left Input Stream (Candidate Tokens) */}
      <group ref={streamRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[-2 - i * 0.6, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0284c7"
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Central Pulsing Neural Core */}
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Inner high-energy core */}
        <mesh>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Outer glowing wireframe icosahedron */}
        <mesh>
          <icosahedronGeometry args={[0.95, 1]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={0.9}
            wireframe
          />
        </mesh>

        {/* Orbiting data ring */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Projected Next Token (Golden Prediction Cube) */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
        <mesh ref={projectedCubeRef} position={[1.5, 0, 0]}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.6}
            roughness={0.15}
            metalness={0.9}
            transparent
          />
        </mesh>
      </Float>
    </group>
  );
}
