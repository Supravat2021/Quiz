import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ5FewShotBeams() {
  const prismsRef = useRef<THREE.Group>(null);
  const targetSphereRef = useRef<THREE.Mesh>(null);
  const beamsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (prismsRef.current) {
      prismsRef.current.children.forEach((prism, i) => {
        prism.rotation.y = t * 1.2 + i * 0.8;
        prism.rotation.x = Math.sin(t * 2 + i) * 0.2;
        prism.position.y = -0.8 + Math.sin(t * 2.5 + i) * 0.15;
      });
    }

    if (targetSphereRef.current) {
      targetSphereRef.current.rotation.y = t * 0.8;
      targetSphereRef.current.rotation.x = t * 0.5;

      // Pulse reaction when receiving the 3 shots
      const pulse = 1 + Math.sin(t * 6) * 0.12;
      targetSphereRef.current.scale.set(pulse, pulse, pulse);

      const mat = targetSphereRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.2 + Math.sin(t * 6) * 0.8;
      }
    }

    if (beamsRef.current) {
      beamsRef.current.children.forEach((beam) => {
        const mat = (beam as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = 0.5 + Math.sin(t * 8) * 0.4;
        }
      });
    }
  });

  // Prism positions: 3 examples (few-shot)
  const prismPositions: [number, number, number][] = [
    [-1.6, -0.8, 0],
    [0, -0.8, 0.4],
    [1.6, -0.8, 0],
  ];

  const prismColors = ['#06b6d4', '#fbbf24', '#38bdf8'];

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 3]} intensity={2.5} color="#fbbf24" />
      <pointLight position={[-3, -1, 2]} intensity={2} color="#06b6d4" />
      <pointLight position={[3, -1, 2]} intensity={2} color="#38bdf8" />

      <Sparkles count={40} scale={6} size={2.5} speed={0.6} color="#fbbf24" />

      {/* Target Output Sphere (Synthesized Prompt Result) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
        <mesh ref={targetSphereRef} position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={1.5}
            roughness={0.15}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* 3 Few-Shot Crystal Prisms */}
      <group ref={prismsRef}>
        {prismPositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color={prismColors[idx]}
              emissive={prismColors[idx]}
              emissiveIntensity={1.2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Firing Light Beams (Cylinders connecting Prisms to Target) */}
      <group ref={beamsRef}>
        {prismPositions.map((pos, idx) => {
          // Calculate beam orientation from pos to target [0, 1.1, 0]
          const target = new THREE.Vector3(0, 1.1, 0);
          const start = new THREE.Vector3(...pos);
          const dir = target.clone().sub(start);
          const len = dir.length();
          const mid = start.clone().add(target).multiplyScalar(0.5);

          // Compute rotation to align cylinder (default along Y) with dir
          const quat = new THREE.Quaternion();
          quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          const euler = new THREE.Euler().setFromQuaternion(quat);

          return (
            <mesh key={idx} position={[mid.x, mid.y, mid.z]} rotation={euler}>
              <cylinderGeometry args={[0.025, 0.05, len, 8]} />
              <meshBasicMaterial
                color={prismColors[idx]}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
