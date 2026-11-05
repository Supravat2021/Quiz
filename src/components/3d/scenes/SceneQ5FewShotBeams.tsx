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
        prism.rotation.y = t * 0.8 + i * 0.7;
        prism.rotation.x = Math.sin(t * 1.5 + i) * 0.15;
        prism.position.y = -0.75 + Math.sin(t * 1.8 + i) * 0.1;
      });
    }

    if (targetSphereRef.current) {
      targetSphereRef.current.rotation.y = t * 0.5;
      targetSphereRef.current.rotation.x = t * 0.3;

      const pulse = 1 + Math.sin(t * 4) * 0.08;
      targetSphereRef.current.scale.set(pulse, pulse, pulse);

      const mat = targetSphereRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.1 + Math.sin(t * 4) * 0.5;
      }
    }

    if (beamsRef.current) {
      beamsRef.current.children.forEach((beam) => {
        const mat = (beam as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = 0.45 + Math.sin(t * 6) * 0.25;
        }
      });
    }
  });

  const prismPositions: [number, number, number][] = [
    [-1.5, -0.75, 0],
    [0, -0.75, 0.3],
    [1.5, -0.75, 0],
  ];

  const prismColors = ['#2dd4bf', '#f5d061', '#38bdf8'];

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 3, 3]} intensity={2.5} color="#f5d061" />
      <pointLight position={[-3, -1, 2]} intensity={2} color="#2dd4bf" />
      <pointLight position={[3, -1, 2]} intensity={2} color="#38bdf8" />

      <Sparkles count={35} scale={6} size={2} speed={0.4} color="#f5d061" opacity={0.35} />

      {/* Target Output Celestial Sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={targetSphereRef} position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial
            color="#f5d061"
            emissive="#d4a329"
            emissiveIntensity={1.3}
            roughness={0.12}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* 3 Few-Shot Crystal Prisms */}
      <group ref={prismsRef}>
        {prismPositions.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <octahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial
              color={prismColors[idx]}
              emissive={prismColors[idx]}
              emissiveIntensity={1}
              roughness={0.15}
              metalness={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Focused Coherent Laser Filaments */}
      <group ref={beamsRef}>
        {prismPositions.map((pos, idx) => {
          const target = new THREE.Vector3(0, 1.05, 0);
          const start = new THREE.Vector3(...pos);
          const dir = target.clone().sub(start);
          const len = dir.length();
          const mid = start.clone().add(target).multiplyScalar(0.5);

          const quat = new THREE.Quaternion();
          quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          const euler = new THREE.Euler().setFromQuaternion(quat);

          return (
            <mesh key={idx} position={[mid.x, mid.y, mid.z]} rotation={euler}>
              <cylinderGeometry args={[0.015, 0.035, len, 8]} />
              <meshBasicMaterial
                color={prismColors[idx]}
                transparent
                opacity={0.65}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
