import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ4StrictExaminer() {
  const capRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (capRef.current) {
      capRef.current.rotation.y = t * 0.45;
      capRef.current.rotation.z = Math.sin(t * 1.2) * 0.05;
    }

    if (shieldRef.current) {
      shieldRef.current.rotation.y = -t * 0.35;
      shieldRef.current.position.y = -0.55 + Math.sin(t * 1.5) * 0.08;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.25;
      const s = 1 + Math.sin(t * 2) * 0.04;
      haloRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 3, 3]} intensity={2.4} color="#f5d061" />
      <pointLight position={[-3, -1, 2]} intensity={1.8} color="#38bdf8" />

      <Sparkles count={30} scale={5} size={2} speed={0.3} color="#f5d061" opacity={0.35} />

      {/* Floating Stately Academic Mortarboard */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <group ref={capRef} position={[0, 0.72, 0]}>
          {/* Diamond Scholar Top Board */}
          <mesh rotation={[Math.PI / 10, Math.PI / 4, 0]}>
            <boxGeometry args={[1.4, 0.045, 1.4]} />
            <meshStandardMaterial
              color="#0a0f1d"
              emissive="#1e293b"
              emissiveIntensity={0.3}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Golden Center Cap Button */}
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#f5d061" emissive="#d4a329" emissiveIntensity={1.4} />
          </mesh>

          {/* Golden Tassel Filament & Pendant */}
          <mesh position={[0.42, -0.18, 0.42]}>
            <cylinderGeometry args={[0.015, 0.015, 0.45, 8]} />
            <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0.42, -0.42, 0.42]}>
            <coneGeometry args={[0.065, 0.15, 12]} />
            <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={1.4} />
          </mesh>

          {/* Skull Cap Base */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.52, 0.42, 0.35, 24]} />
            <meshStandardMaterial color="#0a0f1d" roughness={0.4} />
          </mesh>
        </group>
      </Float>

      {/* Authoritative Evaluation Shield */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.4}>
        <group ref={shieldRef} position={[0, -0.65, 0]}>
          {/* Shield Chassis */}
          <mesh>
            <boxGeometry args={[1.05, 1.35, 0.06]} />
            <meshStandardMaterial
              color="#090d19"
              emissive="#1e3a8a"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>

          {/* Golden Top Fastener / Clamp */}
          <mesh position={[0, 0.62, 0.05]}>
            <boxGeometry args={[0.42, 0.1, 0.05]} />
            <meshStandardMaterial
              color="#f5d061"
              emissive="#f5d061"
              emissiveIntensity={1.6}
            />
          </mesh>

          {/* Fine Evaluation Seal */}
          <mesh position={[0, 0, 0.05]}>
            <torusGeometry args={[0.28, 0.025, 16, 32]} />
            <meshStandardMaterial
              color="#2dd4bf"
              emissive="#2dd4bf"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      </Float>

      {/* Subtle Authority Halo */}
      <mesh ref={haloRef} position={[0, 0, -0.2]}>
        <torusGeometry args={[1.75, 0.012, 16, 80]} />
        <meshStandardMaterial
          color="#f5d061"
          emissive="#f5d061"
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>
    </group>
  );
}
