import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ8GPTTransformerTower() {
  const towerRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (towerRef.current) {
      towerRef.current.rotation.y = t * 0.4;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.children.forEach((ring, i) => {
        ring.rotation.z = t * (i % 2 === 0 ? 1 : -1) * 0.8;
      });
    }

    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((node, i) => {
        const mat = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = 1 + Math.sin(t * 5 + i) * 0.8;
        }
      });
    }
  });

  const layers = [-1.1, -0.4, 0.3, 1.0]; // 4 Transformer stack blocks

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 3]} intensity={2.5} color="#fbbf24" />
      <pointLight position={[-3, 0, 2]} intensity={2} color="#06b6d4" />
      <pointLight position={[3, -2, 2]} intensity={2} color="#3b82f6" />

      <Sparkles count={50} scale={6} size={2.5} speed={0.5} color="#38bdf8" />

      {/* Main Multi-Layer Transformer Tower */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group ref={towerRef}>
          {/* Stack of Hexagonal Transformer Attention Layers */}
          {layers.map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              {/* Hexagonal Attention Plate */}
              <mesh>
                <cylinderGeometry args={[1.1, 1.1, 0.1, 6]} />
                <meshStandardMaterial
                  color="#111e42"
                  emissive="#1e3a8a"
                  emissiveIntensity={0.6}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>

              {/* Glowing perimeter border */}
              <mesh>
                <cylinderGeometry args={[1.12, 1.12, 0.05, 6]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={1.5}
                  wireframe
                />
              </mesh>
            </group>
          ))}

          {/* Central Neural Attention Core Beam */}
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2.5, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.6}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Pulsing Interconnected Nodes (Key/Value/Query Heads) */}
          <group ref={nodesGroupRef}>
            {layers.flatMap((y, lIdx) =>
              [0, 1, 2, 3, 4, 5].map((nodeIdx) => {
                const angle = (nodeIdx * Math.PI * 2) / 6;
                const radius = 0.95;
                const nx = Math.cos(angle) * radius;
                const nz = Math.sin(angle) * radius;
                return (
                  <mesh key={`${lIdx}-${nodeIdx}`} position={[nx, y, nz]}>
                    <sphereGeometry args={[0.09, 16, 16]} />
                    <meshStandardMaterial
                      color="#fbbf24"
                      emissive="#fbbf24"
                      emissiveIntensity={1.5}
                    />
                  </mesh>
                );
              })
            )}
          </group>

          {/* Rotating Data Rings around the Transformer Tower */}
          <group ref={ringGroupRef}>
            {layers.map((y, idx) => (
              <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.35, 0.02, 16, 64]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#06b6d4' : '#fbbf24'}
                  emissive={idx % 2 === 0 ? '#06b6d4' : '#fbbf24'}
                  emissiveIntensity={1.4}
                  transparent
                  opacity={0.65}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
    </group>
  );
}

