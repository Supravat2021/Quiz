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
      towerRef.current.rotation.y = t * 0.3;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.children.forEach((ring, i) => {
        ring.rotation.z = t * (i % 2 === 0 ? 0.6 : -0.6);
      });
    }

    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((node, i) => {
        const mat = (node as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.emissiveIntensity = 0.9 + Math.sin(t * 3.5 + i) * 0.6;
        }
      });
    }
  });

  const layers = [-1.05, -0.35, 0.35, 1.05];

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 3]} intensity={2.4} color="#f5d061" />
      <pointLight position={[-3, 0, 2]} intensity={1.8} color="#2dd4bf" />
      <pointLight position={[3, -2, 2]} intensity={1.8} color="#38bdf8" />

      <Sparkles count={40} scale={6} size={2} speed={0.35} color="#38bdf8" opacity={0.35} />

      {/* Main Multi-Stage Transformer Architecture Tower */}
      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.3}>
        <group ref={towerRef}>
          {/* Stack of Precision Hexagonal Attention Wafers */}
          {layers.map((y, idx) => (
            <group key={idx} position={[0, y, 0]}>
              {/* Hexagonal Attention Plate */}
              <mesh>
                <cylinderGeometry args={[1.05, 1.05, 0.08, 6]} />
                <meshStandardMaterial
                  color="#0c1222"
                  emissive="#1e293b"
                  emissiveIntensity={0.5}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>

              {/* Glowing perimeter border */}
              <mesh>
                <cylinderGeometry args={[1.07, 1.07, 0.04, 6]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={1.2}
                  wireframe
                />
              </mesh>
            </group>
          ))}

          {/* Central Neural Attention Bus Conduit */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 2.4, 16]} />
            <meshStandardMaterial
              color="#f5d061"
              emissive="#d4a329"
              emissiveIntensity={1.4}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Pulsing Interconnected Key/Query/Value Nodes */}
          <group ref={nodesGroupRef}>
            {layers.flatMap((y, lIdx) =>
              [0, 1, 2, 3, 4, 5].map((nodeIdx) => {
                const angle = (nodeIdx * Math.PI * 2) / 6;
                const radius = 0.92;
                const nx = Math.cos(angle) * radius;
                const nz = Math.sin(angle) * radius;
                return (
                  <mesh key={`${lIdx}-${nodeIdx}`} position={[nx, y, nz]}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshStandardMaterial
                      color="#f5d061"
                      emissive="#f5d061"
                      emissiveIntensity={1.3}
                    />
                  </mesh>
                );
              })
            )}
          </group>

          {/* Counter-Rotating Orbital Data Rings */}
          <group ref={ringGroupRef}>
            {layers.map((y, idx) => (
              <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.28, 0.012, 16, 80]} />
                <meshStandardMaterial
                  color={idx % 2 === 0 ? '#2dd4bf' : '#f5d061'}
                  emissive={idx % 2 === 0 ? '#2dd4bf' : '#f5d061'}
                  emissiveIntensity={1.2}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
    </group>
  );
}
