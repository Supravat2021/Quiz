import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function SceneQ7AspectRatio() {
  const frameGroupRef = useRef<THREE.Group>(null);
  const frustumGroupRef = useRef<THREE.Group>(null);

  const width = 2.4;
  const height = (width * 9) / 16; // 1.35

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (frameGroupRef.current) {
      frameGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      frameGroupRef.current.rotation.x = Math.cos(t * 0.4) * 0.1;
    }

    if (frustumGroupRef.current) {
      frustumGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
      frustumGroupRef.current.rotation.x = Math.cos(t * 0.4) * 0.1;
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
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 2, 3]} intensity={2.2} color="#f5d061" />
      <pointLight position={[0, -2, 2]} intensity={1.8} color="#2dd4bf" />

      <Sparkles count={30} scale={5} size={2} speed={0.3} color="#f5d061" opacity={0.35} />

      {/* Main 16:9 Rotating Holographic Viewport */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <group ref={frameGroupRef}>
          {/* Outer Titanium Bezel */}
          <mesh>
            <boxGeometry args={[width + 0.08, height + 0.08, 0.04]} />
            <meshStandardMaterial
              color="#090d19"
              emissive="#1e293b"
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>

          {/* Inner Translucent 16:9 Hologram Surface */}
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              color="#2dd4bf"
              emissive="#0d9488"
              emissiveIntensity={0.5}
              transparent
              opacity={0.25}
              roughness={0.1}
            />
          </mesh>

          {/* Champagne Gold Perimeter Outline */}
          <lineSegments position={[0, 0, 0.045]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
            <lineBasicMaterial color="#f5d061" linewidth={2} />
          </lineSegments>

          {/* Rule of Thirds Grid lines */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[width * 0.98, height * 0.98, 3, 3]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.2} />
          </mesh>

          {/* Minimalist Corner Crosshairs */}
          {corners.map(([cx, cy], i) => (
            <mesh key={i} position={[cx, cy, 0.05]}>
              <boxGeometry args={[0.15, 0.15, 0.03]} />
              <meshBasicMaterial color="#f5d061" wireframe />
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
              <cylinderGeometry args={[0.008, 0.008, len, 6]} />
              <meshBasicMaterial color="#2dd4bf" transparent opacity={0.35} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
