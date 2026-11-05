import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ9TruthIllusionPortals() {
  const truthRef = useRef<THREE.Mesh>(null);
  const illusionRef = useRef<THREE.Mesh>(null);
  const portalRingRef = useRef<THREE.Group>(null);
  const bridgeParticlesRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Solid grounded truth cube
    if (truthRef.current) {
      truthRef.current.rotation.y = t * 0.5;
      truthRef.current.rotation.x = Math.sin(t * 0.4) * 0.1;
    }

    // Shimmering illusion sphere
    if (illusionRef.current) {
      illusionRef.current.rotation.y = -t * 0.8;
      illusionRef.current.position.y = Math.sin(t * 2) * 0.15;
    }

    // Portal intersection boundary ring
    if (portalRingRef.current) {
      portalRingRef.current.rotation.z = t * 1.2;
    }

    // Floating particles exchanging between truth and illusion
    if (bridgeParticlesRef.current) {
      bridgeParticlesRef.current.children.forEach((p, i) => {
        const offset = ((t * 1.5 + i * 0.5) % 2.4) - 1.2;
        p.position.x = offset;
        p.position.y = Math.sin(t * 3 + i) * 0.2;
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[-2, 2, 3]} intensity={2.5} color="#06b6d4" />
      <pointLight position={[2, 2, 3]} intensity={2.5} color="#f43f5e" />

      <Sparkles count={45} scale={6} size={2.5} speed={0.5} color="#fbbf24" />

      {/* LEFT: Solid Cyan Truth Portal (Grounded Cube) */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <group position={[-1.2, 0, 0]}>
          <mesh ref={truthRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0284c7"
              emissiveIntensity={1}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* Wireframe integrity border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
            <lineBasicMaterial color="#38bdf8" />
          </lineSegments>
        </group>
      </Float>

      {/* RIGHT: Shimmering Translucent Illusion Sphere (Distorted Mirage) */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh ref={illusionRef} position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={0.8}
            distort={0.45}
            speed={3}
            roughness={0.1}
            metalness={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>

      {/* Intersecting Dimensional Portal Ring */}
      <group ref={portalRingRef} position={[0, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.3, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#fbbf24"
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>
      </group>

      {/* Floating Exchange Particles */}
      <group ref={bridgeParticlesRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#06b6d4' : '#f43f5e'}
              emissive={i % 2 === 0 ? '#06b6d4' : '#f43f5e'}
              emissiveIntensity={2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

