import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ3HallucinationMorph() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const glitchGroupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.4;
      sphereRef.current.rotation.y = t * 0.6;
    }

    // Glitching rings rotate and snap jitter
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 1.5;
      ring1Ref.current.rotation.y = t * 0.8;
      // Periodic subtle glitch offset
      if (Math.sin(t * 12) > 0.85) {
        ring1Ref.current.position.x = (Math.random() - 0.5) * 0.2;
      } else {
        ring1Ref.current.position.x = 0;
      }
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 1.2;
      ring2Ref.current.rotation.y = t * 1.1;
      if (Math.cos(t * 15) > 0.9) {
        ring2Ref.current.position.y = (Math.random() - 0.5) * 0.2;
      } else {
        ring2Ref.current.position.y = 0;
      }
    }

    if (glitchGroupRef.current) {
      // Shimmering micro-crystals
      glitchGroupRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 2, 4]} intensity={2.5} color="#ec4899" />
      <pointLight position={[-3, -2, 2]} intensity={2.5} color="#06b6d4" />

      <Sparkles count={50} scale={6} size={2.5} speed={0.8} color="#f43f5e" />

      {/* Morphing Distorted Sphere */}
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#06b6d4"
            emissive="#ec4899"
            emissiveIntensity={0.6}
            distort={0.65}
            speed={4}
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
      </Float>

      {/* Outer Glitching Wireframe Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#f43f5e"
          emissive="#e11d48"
          emissiveIntensity={2}
          wireframe
        />
      </mesh>

      {/* Outer Glitching Wireframe Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#d97706"
          emissiveIntensity={1.8}
          wireframe
        />
      </mesh>

      {/* Floating Illusion shards */}
      <group ref={glitchGroupRef}>
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 2.2, Math.sin(angle * 2) * 0.6, Math.sin(angle) * 2.2]}
            >
              <octahedronGeometry args={[0.2]} />
              <meshStandardMaterial
                color="#a855f7"
                emissive="#9333ea"
                emissiveIntensity={1.5}
                wireframe
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

