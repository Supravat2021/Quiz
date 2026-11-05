import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function FloatingConstellation() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Floating Polyhedron */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh position={[0, 0, -2]}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      {/* Orbiting Golden Ring */}
      <mesh ref={ringRef} position={[0, 0, -2]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.02, 16, 80]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Small accent floating nodes */}
      {[-3, 3, -2, 2].map((x, i) => (
        <Float key={i} speed={1.8 + i * 0.3} rotationIntensity={0.8} floatIntensity={0.8}>
          <mesh position={[x, (i % 2 === 0 ? 1.5 : -1.5), -1 - i * 0.5]}>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#fbbf24' : '#38bdf8'}
              emissive={i % 2 === 0 ? '#fbbf24' : '#38bdf8'}
              emissiveIntensity={1.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function BackgroundCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#fbbf24" />
        <pointLight position={[-5, -5, 5]} intensity={1.5} color="#06b6d4" />

        <Stars
          radius={50}
          depth={40}
          count={2500}
          factor={3.5}
          saturation={0.5}
          fade
          speed={0.8}
        />
        <Sparkles count={40} scale={10} size={2} speed={0.4} color="#38bdf8" />

        <FloatingConstellation />
      </Canvas>
    </div>
  );
}
