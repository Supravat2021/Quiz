import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function AestheticNebulaCore() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.03) * 0.08;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.07;
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.05) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.05;
      ring2Ref.current.rotation.y = Math.PI / 6 + Math.cos(t * 0.04) * 0.08;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.08;
      coreRef.current.rotation.z = Math.sin(t * 0.1) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Central Translucent Celestial Core */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshPhysicalMaterial
            color="#0f172a"
            emissive="#1e293b"
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.8}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </Float>

      {/* Primary Orbital Golden Halo */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.015, 16, 120]} />
        <meshStandardMaterial
          color="#f5d061"
          emissive="#d4a329"
          emissiveIntensity={0.6}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Secondary Orbital Cyan Halo */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.6, 0.012, 16, 120]} />
        <meshStandardMaterial
          color="#2dd4bf"
          emissive="#0d9488"
          emissiveIntensity={0.5}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Floating Harmonic Spheres */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 3.2, Math.sin(angle) * 0.8, Math.sin(angle) * 3.2]}
          >
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#f5d061' : '#2dd4bf'}
              emissive={i % 2 === 0 ? '#f5d061' : '#2dd4bf'}
              emissiveIntensity={1.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function BackgroundCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#060913', 4, 18]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[6, 4, 4]} intensity={1.8} color="#f5d061" />
        <pointLight position={[-6, -4, 4]} intensity={1.5} color="#2dd4bf" />

        <Sparkles count={35} scale={12} size={1.8} speed={0.2} color="#f5d061" opacity={0.3} />
        <Sparkles count={25} scale={10} size={1.5} speed={0.2} color="#2dd4bf" opacity={0.25} />

        <AestheticNebulaCore />
      </Canvas>
    </div>
  );
}
