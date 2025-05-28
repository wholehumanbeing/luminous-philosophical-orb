
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { getSphereRadii, philosophicalDomains } from '../utils/sacredGeometry';

interface PhilosophicalSphereProps {
  hoveredDomain: string | null;
}

export const PhilosophicalSphere = ({ hoveredDomain }: PhilosophicalSphereProps) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const radii = getSphereRadii(10);

  // Gentle rotation animation
  useFrame((state) => {
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Create sphere materials with domain-specific colors and transparency
  const sphereMaterials = useMemo(() => {
    return radii.map((_, index) => {
      const domain = philosophicalDomains[index % philosophicalDomains.length];
      const isHovered = hoveredDomain === domain.name;
      
      return new THREE.MeshPhongMaterial({
        color: domain.color,
        transparent: true,
        opacity: 0.7, // 70% opacity as requested
        side: THREE.DoubleSide,
        shininess: 100,
        specular: new THREE.Color(domain.color).multiplyScalar(0.5),
        emissive: new THREE.Color(domain.color).multiplyScalar(0.1) // Subtle bloom effect
      });
    });
  }, [hoveredDomain, radii]);

  return (
    <group ref={sphereGroupRef}>
      {/* Eight nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => (
        <Sphere
          key={index}
          args={[radius, 72, 36]} // theta 72, phi 36 segments as requested
          material={sphereMaterials[index]}
          position={[0, 0, 0]}
        />
      ))}
    </group>
  );
};
