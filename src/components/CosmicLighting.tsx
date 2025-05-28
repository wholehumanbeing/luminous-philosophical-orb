
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicLighting = () => {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (pointLightRef.current) {
      pointLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      pointLightRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      {/* Ambient cosmic glow */}
      <ambientLight intensity={0.3} color="#1a1b3a" />
      
      {/* Main golden directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        intensity={0.8}
        color="#d4af37"
        castShadow
      />
      
      {/* Moving ethereal point light */}
      <pointLight
        ref={pointLightRef}
        position={[2, 3, 2]}
        intensity={0.6}
        color="#4a6b6b"
        distance={10}
      />
      
      {/* Mystical teal rim light */}
      <pointLight
        position={[-3, -2, 3]}
        intensity={0.4}
        color="#5a7a7a"
        distance={8}
      />
      
      {/* Soft silver fill light */}
      <spotLight
        position={[0, 5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={0.3}
        color="#c0c0c0"
      />
    </>
  );
};
