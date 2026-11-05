import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ7AspectRatio() {
  const frameGroupRef = useRef<THREE.Group>(null);
  const frustumGroupRef = useRef<THREE.Group>(null);

  // 16:9 Dimensions scaled for 3D viewport
  const width = 2.4;
  const height = (width * 9) / 16; // 1.35

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (frameGroupRef.current) {
      frameGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.35;
      frameGroupRef.current.rotation.x = Math.cos(t * 0.6) * 0.15;
    }

    if (frustumGroupRef.current) {
      frustumGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.35;
      frustumGroupRef.current.rotation.x = Math.cos(t * 0.6) * 0.15;
    }
  });

  const corners: [number, number][] = [
    [-width / 2, height / 2],
    [width / 2, height / 2],
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
  ];

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 2, 3]} intensity={2.5} color="#fbbf24" />
      <pointLight position={[0, -2, 2]} intensity={2} color="#06b6d4" />

      <Sparkles count={35} scale={5} size={2.5} speed={0.4} color="#fbbf24" />

      {/* Main 16:9 Rotating Holographic Frame */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
        <group ref={frameGroupRef}>
          {/* Outer Border Bezel */}
          <mesh>
            <boxGeometry args={[width + 0.1, height + 0.1, 0.05]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive="#1e293b"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Inner Glowing 16:9 Hologram Surface */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0891b2"
              emissiveIntensity={0.8}
              transparent
              opacity={0.35}
              roughness={0.1}
            />
          </mesh>

          {/* Golden 16:9 Neon Perimeter Outline */}
          <lineSegments position={[0, 0, 0.06]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
            <lineBasicMaterial color="#fbbf24" linewidth={3} />
          </lineSegments>

          {/* Grid lines inside frame */}
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[width * 0.98, height * 0.98, 4, 3]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.3} />
          </mesh>

          {/* Corner Focus Brackets */}
          {corners.map(([cx, cy], i) => (
            <mesh key={i} position={[cx, cy, 0.07]}>
              <boxGeometry args={[0.2, 0.2, 0.04]} />
              <meshBasicMaterial color="#fbbf24" wireframe />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Camera Frustum Projection Lines */}
      <group ref={frustumGroupRef} position={[0, 0, 0]}>
        {corners.map(([cx, cy], i) => {
          const origin = new THREE.Vector3(0, 0, -2);
          const corner = new THREE.Vector3(cx, cy, 0);
          const dir = corner.clone().sub(origin);
          const len = dir.length();
          const mid = origin.clone().add(corner).multiplyScalar(0.5);

          const quat = new THREE.Quaternion();
          quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          const euler = new THREE.Euler().setFromQuaternion(quat);

          return (
            <mesh key={i} position={[mid.x, mid.y, mid.z]} rotation={euler}>
              <cylinderGeometry args={[0.012, 0.012, len, 6]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
