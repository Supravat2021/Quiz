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

    if (truthRef.current) {
      truthRef.current.rotation.y = t * 0.35;
      truthRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }

    if (illusionRef.current) {
      illusionRef.current.rotation.y = -t * 0.6;
      illusionRef.current.position.y = Math.sin(t * 1.5) * 0.12;
    }

    if (portalRingRef.current) {
      portalRingRef.current.rotation.z = t * 0.8;
    }

    if (bridgeParticlesRef.current) {
      bridgeParticlesRef.current.children.forEach((p, i) => {
        const offset = ((t * 1.2 + i * 0.4) % 2.2) - 1.1;
        p.position.x = offset;
        p.position.y = Math.sin(t * 2.5 + i) * 0.15;
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[-2, 2, 3]} intensity={2.2} color="#2dd4bf" />
      <pointLight position={[2, 2, 3]} intensity={2.2} color="#f43f5e" />

      <Sparkles count={35} scale={6} size={2} speed={0.4} color="#f5d061" opacity={0.35} />

      {/* LEFT: Solid Azure Truth Portal (Grounded Symmetry) */}
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.25}>
        <group position={[-1.15, 0, 0]}>
          <mesh ref={truthRef}>
            <boxGeometry args={[0.92, 0.92, 0.92]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive="#14b8a6"
              emissiveIntensity={0.7}
              roughness={0.15}
              metalness={0.85}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.94, 0.94, 0.94)]} />
            <lineBasicMaterial color="#38bdf8" />
          </lineSegments>
        </group>
      </Float>

      {/* RIGHT: Shimmering Translucent Illusion Sphere (Organic Mirage) */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh ref={illusionRef} position={[1.15, 0, 0]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <MeshDistortMaterial
            color="#fb7185"
            emissive="#e11d48"
            emissiveIntensity={0.7}
            distort={0.38}
            speed={2.5}
            roughness={0.1}
            metalness={0.7}
            transparent
            opacity={0.82}
          />
        </mesh>
      </Float>

      {/* Intersecting Dimensional Gateway Halo */}
      <group ref={portalRingRef} position={[0, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.2, 0.025, 16, 80]} />
          <meshStandardMaterial
            color="#f5d061"
            emissive="#f5d061"
            emissiveIntensity={1.4}
            wireframe
          />
        </mesh>
      </group>

      {/* Quantum Bridge Exchange Particles */}
      <group ref={bridgeParticlesRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#2dd4bf' : '#fb7185'}
              emissive={i % 2 === 0 ? '#2dd4bf' : '#fb7185'}
              emissiveIntensity={1.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
