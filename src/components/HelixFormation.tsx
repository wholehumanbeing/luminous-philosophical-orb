
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HelixFormationProps {
  sphereCount: number;
  animationProgress: number;
  maxHeight: number;
}

export const HelixFormation = ({ sphereCount, animationProgress, maxHeight }: HelixFormationProps) => {
  const helixGroupRef = useRef<THREE.Group>(null);

  // Generate double helix positions
  const helixPositions = useMemo(() => {
    const positions = [];
    const heightStep = maxHeight / sphereCount;
    
    for (let i = 0; i < sphereCount; i++) {
      const t = i / sphereCount;
      const angle1 = t * Math.PI * 4; // First helix strand
      const angle2 = angle1 + Math.PI; // Second helix strand (180° offset)
      const y = (i - sphereCount / 2) * heightStep;
      const radius = 8;
      
      // First strand
      positions.push({
        position: new THREE.Vector3(
          Math.cos(angle1) * radius,
          y,
          Math.sin(angle1) * radius
        ),
        scale: 1 - t * 0.3 // Slightly smaller towards the top
      });
      
      // Second strand
      positions.push({
        position: new THREE.Vector3(
          Math.cos(angle2) * radius,
          y,
          Math.sin(angle2) * radius
        ),
        scale: 1 - t * 0.3
      });
    }
    
    return positions;
  }, [sphereCount, maxHeight]);

  // Create helix material with gradient effect
  const helixMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color().lerpColors(
        new THREE.Color('#f5f5dc'), // Beige
        new THREE.Color('#40e0d0'), // Turquoise
        animationProgress
      ),
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
  }, [animationProgress]);

  // Gentle rotation
  useFrame((state) => {
    if (helixGroupRef.current) {
      helixGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={helixGroupRef}>
      {helixPositions.map((helix, index) => (
        <mesh
          key={index}
          position={helix.position}
          material={helixMaterial}
          scale={helix.scale}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
};
