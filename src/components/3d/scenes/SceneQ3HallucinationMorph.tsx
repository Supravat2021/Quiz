import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ3HallucinationMorph() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const shardsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.3;
      sphereRef.current.rotation.y = t * 0.45;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.9;
      ring1Ref.current.rotation.y = t * 0.6;
      // Subtle quantum phase jitter
      if (Math.sin(t * 10) > 0.92) {
        ring1Ref.current.position.x = (Math.random() - 0.5) * 0.12;
      } else {
        ring1Ref.current.position.x = 0;
      }
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.8;
      ring2Ref.current.rotation.y = t * 0.7;
      if (Math.cos(t * 12) > 0.94) {
        ring2Ref.current.position.y = (Math.random() - 0.5) * 0.12;
      } else {
        ring2Ref.current.position.y = 0;
      }
    }

    if (shardsRef.current) {
      shardsRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 3, 3]} intensity={2.6} color="#c084fc" />
      <pointLight position={[-3, -2, 2]} intensity={2.2} color="#2dd4bf" />
      <pointLight position={[0, -3, -2]} intensity={1.8} color="#f5d061" />

      <Sparkles count={40} scale={6} size={2} speed={0.5} color="#c084fc" opacity={0.4} />

      {/* Morphing Pearlescent Liquid Mirage Orb */}
      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <sphereGeometry args={[0.95, 64, 64]} />
          <MeshDistortMaterial
            color="#2dd4bf"
            emissive="#a855f7"
            emissiveIntensity={0.65}
            distort={0.42}
            speed={2.8}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Outer Gyroscopic Wireframe Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.015, 16, 96]} />
        <meshStandardMaterial
          color="#c084fc"
          emissive="#9333ea"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>

      {/* Outer Gyroscopic Wireframe Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#f5d061"
          emissive="#d97706"
          emissiveIntensity={1.4}
          wireframe
        />
      </mesh>

      {/* Floating Prismatic Shards */}
      <group ref={shardsRef}>
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 2.2, Math.sin(angle * 2) * 0.5, Math.sin(angle) * 2.2]}
            >
              <octahedronGeometry args={[0.16]} />
              <meshStandardMaterial
                color="#e879f9"
                emissive="#c026d3"
                emissiveIntensity={1.3}
                wireframe
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
