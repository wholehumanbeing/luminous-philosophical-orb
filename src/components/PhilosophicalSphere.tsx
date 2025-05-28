
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { getSphereRadii, philosophicalDomains } from '../utils/sacredGeometry';
import { SacredGeometryPatterns } from './SacredGeometryPatterns';
import { calculateHelixPosition, easeInOutCubic } from '../utils/animationUtils';

interface PhilosophicalSphereProps {
  hoveredDomain: string | null;
  isUnraveling: boolean;
  animationProgress: number;
  isUnraveled: boolean;
}

export const PhilosophicalSphere = ({ 
  hoveredDomain, 
  isUnraveling, 
  animationProgress, 
  isUnraveled 
}: PhilosophicalSphereProps) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);
  const radii = getSphereRadii(10);

  // Gentle rotation animation (disabled during unraveling)
  useFrame((state) => {
    if (sphereGroupRef.current && !isUnraveling && !isUnraveled) {
      sphereGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // Animation effect for sphere transformation
  useEffect(() => {
    if (isUnraveling && sphereRefs.current.length > 0) {
      const maxHeight = 60; // 80% of viewport height approximation
      
      sphereRefs.current.forEach((sphere, index) => {
        if (sphere) {
          const targetPosition = calculateHelixPosition(
            radii[index],
            index,
            radii.length,
            animationProgress,
            maxHeight
          );
          
          sphere.position.lerp(targetPosition, 0.1);
        }
      });
    }
  }, [animationProgress, isUnraveling, radii]);

  // Create sphere material properties for each sphere
  const sphereMaterialProps = useMemo(() => {
    return radii.map((_, index) => {
      const domain = philosophicalDomains[index % philosophicalDomains.length];
      
      // Color transition during animation
      let color = domain.color;
      if (isUnraveling || isUnraveled) {
        const beige = new THREE.Color('#f5f5dc');
        const turquoise = new THREE.Color('#40e0d0');
        const gradientColor = beige.clone().lerp(turquoise, animationProgress);
        color = `#${gradientColor.getHexString()}`;
      }
      
      const baseColor = new THREE.Color(color);
      const specularColor = baseColor.clone().multiplyScalar(0.5);
      const emissiveColor = baseColor.clone().multiplyScalar(0.1);
      
      return {
        color: color,
        transparent: true,
        opacity: isUnraveling || isUnraveled ? 0.6 : 0.7,
        shininess: 100,
        specular: specularColor,
        emissive: emissiveColor
      };
    });
  }, [hoveredDomain, radii, isUnraveling, isUnraveled, animationProgress]);

  return (
    <group ref={sphereGroupRef}>
      {/* Eight nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => (
        <group key={index}>
          <Sphere
            ref={(ref) => (sphereRefs.current[index] = ref)}
            args={[radius, 72, 36]}
            position={[0, 0, 0]}
          >
            <meshPhongMaterial {...sphereMaterialProps[index]} />
          </Sphere>
          {/* Add sacred geometry patterns to each sphere (hide during animation) */}
          {!isUnraveling && !isUnraveled && (
            <SacredGeometryPatterns radius={radius} />
          )}
        </group>
      ))}
    </group>
  );
};
