import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ10FaceIDScan() {
  const headGroupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Group>(null);
  const phoneFrameRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * 0.6) * 0.2;
      headGroupRef.current.rotation.x = Math.sin(t * 0.4) * 0.06;
    }

    if (scanLineRef.current) {
      const scanY = Math.sin(t * 1.8) * 1.05;
      scanLineRef.current.position.y = scanY;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 2, 3]} intensity={2.6} color="#2dd4bf" />
      <pointLight position={[0, -2, 2]} intensity={1.8} color="#f5d061" />

      <Sparkles count={35} scale={5} size={2} speed={0.4} color="#2dd4bf" opacity={0.35} />

      {/* Floating Dark Sapphire Smartphone Chassis */}
      <group ref={phoneFrameRef} position={[0, 0, -0.2]}>
        <mesh>
          <boxGeometry args={[1.8, 3.0, 0.06]} />
          <meshStandardMaterial
            color="#070c1b"
            roughness={0.15}
            metalness={0.9}
            transparent
            opacity={0.35}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.8, 3.0, 0.06)]} />
          <lineBasicMaterial color="#38bdf8" />
        </lineSegments>
      </group>

      {/* Stylized Low-Poly Geometric Biometric Mask */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={headGroupRef} position={[0, 0, 0.1]}>
          {/* Cranium */}
          <mesh position={[0, 0.18, 0]}>
            <icosahedronGeometry args={[0.62, 2]} />
            <meshStandardMaterial
              color="#0d9488"
              emissive="#14b8a6"
              emissiveIntensity={0.65}
              wireframe
            />
          </mesh>

          {/* Jaw / Chin structure */}
          <mesh position={[0, -0.38, 0.12]}>
            <coneGeometry args={[0.38, 0.52, 6]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.7}
              wireframe
            />
          </mesh>

          {/* Biometric Eye Landmarks */}
          <mesh position={[-0.22, 0.18, 0.52]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.22, 0.18, 0.52]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={2} />
          </mesh>

          {/* Biometric Nose Node */}
          <mesh position={[0, 0.04, 0.6]}>
            <octahedronGeometry args={[0.055, 0]} />
            <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.8} />
          </mesh>

          {/* Biometric Mouth Landmark */}
          <mesh position={[0, -0.2, 0.52]}>
            <boxGeometry args={[0.2, 0.03, 0.03]} />
            <meshStandardMaterial color="#f5d061" emissive="#f5d061" emissiveIntensity={1.6} />
          </mesh>
        </group>
      </Float>

      {/* Vertical Sweeping Coherent Laser Scan Line */}
      <group ref={scanLineRef}>
        <mesh position={[0, 0, 0.68]}>
          <boxGeometry args={[1.7, 0.025, 0.015]} />
          <meshBasicMaterial color="#2dd4bf" />
        </mesh>
        <mesh position={[0, 0, 0.66]}>
          <planeGeometry args={[1.68, 0.14]} />
          <meshBasicMaterial
            color="#2dd4bf"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
