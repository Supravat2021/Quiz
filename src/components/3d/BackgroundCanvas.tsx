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
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.1;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.1;
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.06) * 0.12;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.08;
      ring2Ref.current.rotation.y = Math.PI / 6 + Math.cos(t * 0.05) * 0.1;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.12;
      coreRef.current.rotation.z = Math.sin(t * 0.15) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Central Translucent Celestial Polyhedron */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            emissive="#ec4899"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.7}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Primary Vibrant Fuchsia Halo */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.02, 16, 120]} />
        <meshStandardMaterial
          color="#ff2a85"
          emissive="#ff2a85"
          emissiveIntensity={1.2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Secondary Hyper Cyan Halo */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.016, 16, 120]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Orbiting Candy Spheres */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 3.2, Math.sin(angle) * 0.8, Math.sin(angle) * 3.2]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff2a85' : '#06b6d4'}
              emissive={i % 2 === 0 ? '#ff2a85' : '#06b6d4'}
              emissiveIntensity={2}
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
        <fog attach="fog" args={['#110c24', 4, 17]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 4]} intensity={2.4} color="#ff2a85" />
        <pointLight position={[-6, -4, 4]} intensity={2.2} color="#06b6d4" />
        <pointLight position={[0, 5, 2]} intensity={2} color="#8b5cf6" />

        <Sparkles count={40} scale={12} size={2.2} speed={0.3} color="#ff2a85" opacity={0.5} />
        <Sparkles count={35} scale={10} size={1.8} speed={0.3} color="#06b6d4" opacity={0.45} />
        <Sparkles count={30} scale={11} size={2.0} speed={0.3} color="#f59e0b" opacity={0.4} />

        <AestheticNebulaCore />
      </Canvas>
    </div>
  );
}
