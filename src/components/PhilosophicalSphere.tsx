
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { getSphereRadii, philosophicalDomains, PHI } from '../utils/sacredGeometry';

interface PhilosophicalSphereProps {
  hoveredDomain: string | null;
}

export const PhilosophicalSphere = ({ hoveredDomain }: PhilosophicalSphereProps) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const radii = getSphereRadii(1.5);

  // Gentle rotation animation
  useFrame((state) => {
    if (sphereGroupRef.current) {
      sphereGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Create sphere materials with domain-specific colors
  const sphereMaterials = useMemo(() => {
    return radii.map((_, index) => {
      const domain = philosophicalDomains[index % philosophicalDomains.length];
      const isHovered = hoveredDomain === domain.name;
      
      return new THREE.MeshPhongMaterial({
        color: domain.color,
        transparent: true,
        opacity: isHovered ? 0.4 : 0.15,
        side: THREE.DoubleSide,
        shininess: 100,
        specular: new THREE.Color(domain.color).multiplyScalar(0.5)
      });
    });
  }, [hoveredDomain]);

  return (
    <group ref={sphereGroupRef}>
      {/* Nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => (
        <Sphere
          key={index}
          args={[radius, 32, 32]}
          material={sphereMaterials[index]}
          position={[0, 0, 0]}
        />
      ))}
      
      {/* Sacred geometry rings */}
      <Ring
        args={[radii[0] * 1.1, radii[0] * 1.15, 64]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial
          color="#d4af37"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      <Ring
        args={[radii[1] * 1.05, radii[1] * 1.08, 32]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial
          color="#4a6b6b"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Golden ratio spiral indicator */}
      <Ring
        args={[radii[2] * PHI, radii[2] * PHI * 1.02, 5]}
        rotation={[Math.PI / 4, Math.PI / 4, 0]}
      >
        <meshBasicMaterial
          color="#c0c0c0"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </Ring>
    </group>
  );
};
