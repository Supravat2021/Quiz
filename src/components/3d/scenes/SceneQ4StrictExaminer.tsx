import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ4StrictExaminer() {
  const capRef = useRef<THREE.Group>(null);
  const shieldRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (capRef.current) {
      capRef.current.rotation.y = t * 0.7;
      capRef.current.rotation.z = Math.sin(t * 1.5) * 0.08;
    }

    if (shieldRef.current) {
      shieldRef.current.rotation.y = -t * 0.5;
      shieldRef.current.position.y = -0.5 + Math.sin(t * 2) * 0.1;
    }

    if (auraRef.current) {
      auraRef.current.rotation.z = t * 0.4;
      const s = 1 + Math.sin(t * 3) * 0.05;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 4, 3]} intensity={2.5} color="#fbbf24" />
      <pointLight position={[-3, -1, 2]} intensity={2} color="#3b82f6" />

      <Sparkles count={35} scale={5} size={2.5} speed={0.4} color="#fbbf24" />

      {/* Floating Academic Mortarboard Cap */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <group ref={capRef} position={[0, 0.7, 0]}>
          {/* Flat Diamond Top Board */}
          <mesh rotation={[Math.PI / 8, Math.PI / 4, 0]}>
            <boxGeometry args={[1.5, 0.06, 1.5]} />
            <meshStandardMaterial
              color="#1e1b4b"
              emissive="#312e81"
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Golden Button on Top */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={1.5} />
          </mesh>

          {/* Golden Tassel Cord and Pendant */}
          <mesh position={[0.45, -0.2, 0.45]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[0.45, -0.48, 0.45]}>
            <coneGeometry args={[0.08, 0.18, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>

          {/* Skull Cap Base */}
          <mesh position={[0, -0.25, 0]}>
            <cylinderGeometry args={[0.55, 0.45, 0.4, 24]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.5} />
          </mesh>
        </group>
      </Float>

      {/* Authoritative Clipboard / Shield */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={0.5}>
        <group ref={shieldRef} position={[0, -0.7, 0]}>
          {/* Main Shield / Clipboard Body */}
          <mesh>
            <boxGeometry args={[1.1, 1.4, 0.08]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#1e3a8a"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Glowing Golden Border Ring / Clamp */}
          <mesh position={[0, 0.65, 0.06]}>
            <boxGeometry args={[0.45, 0.12, 0.06]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Evaluation checkmark icon in center */}
          <mesh position={[0, 0, 0.06]}>
            <torusGeometry args={[0.3, 0.04, 16, 32]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      </Float>

      {/* Authority Halo / Rotating Ring */}
      <mesh ref={auraRef} position={[0, 0, -0.2]}>
        <torusGeometry args={[1.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
    </group>
  );
}

