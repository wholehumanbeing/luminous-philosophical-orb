
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
  
  // Generate safe radius array
  const radii = useMemo(() => {
    try {
      const radiusArray = getSphereRadii(10);
      return Array.isArray(radiusArray) && radiusArray.length > 0 ? radiusArray : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } catch (error) {
      console.error("Error generating sphere radii:", error);
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
  }, []);

  // Initialize sphere refs
  useEffect(() => {
    sphereRefs.current = Array(radii.length).fill(null);
  }, [radii.length]);

  // Gentle rotation animation
  useFrame((state) => {
    if (!sphereGroupRef.current || isUnraveling || isUnraveled) return;
    
    try {
      const elapsedTime = state.clock.elapsedTime;
      if (typeof elapsedTime === 'number' && !isNaN(elapsedTime)) {
        sphereGroupRef.current.rotation.y = elapsedTime * 0.1;
        sphereGroupRef.current.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;
      }
    } catch (error) {
      console.error("Error updating sphere rotation:", error);
    }
  });

  // Animation effect for sphere transformation
  useEffect(() => {
    if (!isUnraveling || sphereRefs.current.length === 0) return;
    
    try {
      const maxHeight = 60;
      
      sphereRefs.current.forEach((sphere, index) => {
        if (!sphere || !sphere.position) return;
        
        try {
          const targetPosition = calculateHelixPosition(
            radii[index] || 1,
            index,
            radii.length,
            animationProgress,
            maxHeight
          );
          
          if (targetPosition && typeof targetPosition.x === 'number' && !isNaN(targetPosition.x)) {
            sphere.position.lerp(targetPosition, 0.1);
          }
        } catch (positionError) {
          console.error(`Error calculating position for sphere ${index}:`, positionError);
        }
      });
    } catch (error) {
      console.error("Error animating sphere transformation:", error);
    }
  }, [animationProgress, isUnraveling, radii]);

  if (!Array.isArray(radii) || radii.length === 0) {
    console.error("Failed to generate sphere data");
    return null;
  }

  return (
    <group ref={sphereGroupRef}>
      {radii.map((radius, index) => {
        // Safe radius computation
        const safeRadius = Math.max(0.1, Number(radius) || 1);
        
        // Get domain with fallback
        const domain = philosophicalDomains?.[index % (philosophicalDomains?.length || 1)];
        
        // Simple color computation with guaranteed string values
        let materialColor = '#ffffff';
        
        if (isUnraveling || isUnraveled) {
          // Simple gradient during animation
          const progress = Math.max(0, Math.min(animationProgress, 1));
          const r = Math.floor(245 + (64 - 245) * progress);
          const g = Math.floor(245 + (224 - 245) * progress);
          const b = Math.floor(220 + (208 - 220) * progress);
          materialColor = `rgb(${r}, ${g}, ${b})`;
        } else if (domain && domain.color) {
          materialColor = domain.color;
        }
        
        // Safe opacity
        const materialOpacity = (isUnraveling || isUnraveled) ? 0.6 : 0.7;
        
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
                color={materialColor}
                transparent={true}
                opacity={materialOpacity}
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
