
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { getSphereRadii, philosophicalDomains } from '../utils/sacredGeometry';
import { SacredGeometryPatterns } from './SacredGeometryPatterns';
import { calculateHelixPosition } from '../utils/animationUtils';

interface PhilosophicalSphereProps {
  hoveredDomain?: string | null;
  isUnraveling?: boolean;
  animationProgress?: number;
  isUnraveled?: boolean;
}

export const PhilosophicalSphere = ({ 
  hoveredDomain = null, 
  isUnraveling = false, 
  animationProgress = 0, 
  isUnraveled = false 
}: PhilosophicalSphereProps) => {
  const sphereGroupRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([]);
  
  // Generate safe radius array with fallbacks
  const radii = useMemo(() => {
    try {
      const radiusArray = getSphereRadii(10);
      if (Array.isArray(radiusArray) && radiusArray.length > 0) {
        return radiusArray.map(r => Math.max(0.1, Number(r) || 1));
      }
    } catch (error) {
      console.error("Error generating sphere radii:", error);
    }
    return [1, 2, 3, 4, 5, 6, 7, 8];
  }, []);

  // Initialize sphere refs
  useEffect(() => {
    sphereRefs.current = Array(radii.length).fill(null);
  }, [radii.length]);

  // Safe rotation animation
  useFrame((state) => {
    if (!sphereGroupRef.current || isUnraveling || isUnraveled) return;
    
    const elapsedTime = state.clock?.elapsedTime;
    if (typeof elapsedTime === 'number' && !isNaN(elapsedTime)) {
      sphereGroupRef.current.rotation.y = elapsedTime * 0.1;
      sphereGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
    }
  });

  // Safe animation effect
  useEffect(() => {
    if (!isUnraveling || sphereRefs.current.length === 0) return;
    
    const maxHeight = 60;
    
    sphereRefs.current.forEach((sphere, index) => {
      if (!sphere?.position) return;
      
      try {
        const targetPosition = calculateHelixPosition(
          radii[index] || 1,
          index,
          radii.length,
          animationProgress,
          maxHeight
        );
        
        if (targetPosition && 
            typeof targetPosition.x === 'number' && 
            typeof targetPosition.y === 'number' && 
            typeof targetPosition.z === 'number' &&
            !isNaN(targetPosition.x) && 
            !isNaN(targetPosition.y) && 
            !isNaN(targetPosition.z)) {
          sphere.position.lerp(targetPosition, 0.1);
        }
      } catch (error) {
        console.error(`Error calculating position for sphere ${index}:`, error);
      }
    });
  }, [animationProgress, isUnraveling, radii]);

  if (!Array.isArray(radii) || radii.length === 0) {
    return null;
  }

  return (
    <group ref={sphereGroupRef}>
      {radii.map((radius, index) => {
        // Ensure radius is a valid number
        const safeRadius = Math.max(0.1, Number(radius) || 1);
        
        // Get domain safely
        const domainIndex = index % Math.max(1, philosophicalDomains?.length || 1);
        const domain = philosophicalDomains?.[domainIndex];
        
        // Safe color computation - always return a valid hex string
        let color = "#ffffff";
        
        if (isUnraveling || isUnraveled) {
          const progress = Math.max(0, Math.min(1, animationProgress));
          const r = Math.floor(245 + (64 - 245) * progress);
          const g = Math.floor(245 + (224 - 245) * progress);
          const b = Math.floor(220 + (208 - 220) * progress);
          color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } else if (domain?.color && typeof domain.color === 'string') {
          color = domain.color;
        }
        
        // Ensure opacity is a valid number
        const opacity = (isUnraveling || isUnraveled) ? 0.6 : 0.7;
        
        return (
          <group key={`sphere-group-${index}`}>
            <Sphere
              ref={(ref) => {
                if (ref && sphereRefs.current) {
                  sphereRefs.current[index] = ref;
                }
              }}
              args={[safeRadius, 72, 36]}
              position={[0, 0, 0]}
            >
              <meshPhongMaterial
                color={color}
                transparent
                opacity={opacity}
                shininess={40}
              />
            </Sphere>
            {!isUnraveling && !isUnraveled && (
              <SacredGeometryPatterns radius={safeRadius} />
            )}
          </group>
        );
      })}
    </group>
  );
};
