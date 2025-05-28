
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { getSphereRadii, philosophicalDomains } from '../utils/sacredGeometry';
import { SacredGeometryPatterns } from './SacredGeometryPatterns';
import { calculateHelixPosition, easeInOutCubic } from '../utils/animationUtils';

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
  const materialsRef = useRef<THREE.Material[]>([]);
  
  // Safe radius generation with error handling
  const radii = useMemo(() => {
    try {
      const radiusArray = getSphereRadii(10);
      return Array.isArray(radiusArray) && radiusArray.length > 0 ? radiusArray : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } catch (error) {
      console.error("Error generating sphere radii:", error);
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Fallback radii
    }
  }, []);

  // Validate inputs with safe defaults
  const safeProps = useMemo(() => {
    return {
      hoveredDomain: hoveredDomain || null,
      isUnraveling: Boolean(isUnraveling),
      animationProgress: Math.max(0, Math.min(Number(animationProgress) || 0, 1)),
      isUnraveled: Boolean(isUnraveled)
    };
  }, [hoveredDomain, isUnraveling, animationProgress, isUnraveled]);

  // Initialize sphere refs array with error handling
  useEffect(() => {
    try {
      sphereRefs.current = Array(radii.length).fill(null);
      
      // Clean up materials on unmount
      return () => {
        materialsRef.current.forEach(material => {
          try {
            if (material && typeof material.dispose === 'function') {
              material.dispose();
            }
          } catch (error) {
            console.error("Error disposing material:", error);
          }
        });
        materialsRef.current = [];
      };
    } catch (error) {
      console.error("Error initializing sphere refs:", error);
      sphereRefs.current = [];
    }
  }, [radii.length]);

  // Gentle rotation animation with comprehensive error handling
  useFrame((state) => {
    if (!sphereGroupRef.current || !state || !state.clock || safeProps.isUnraveling || safeProps.isUnraveled) {
      return;
    }
    
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

  // Animation effect for sphere transformation with error handling
  useEffect(() => {
    if (!safeProps.isUnraveling || sphereRefs.current.length === 0) return;
    
    try {
      const maxHeight = 60;
      
      sphereRefs.current.forEach((sphere, index) => {
        if (!sphere || !sphere.position) return;
        
        try {
          const targetPosition = calculateHelixPosition(
            radii[index] || 1,
            index,
            radii.length,
            safeProps.animationProgress,
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
  }, [safeProps.animationProgress, safeProps.isUnraveling, radii]);

  // Guard against invalid data
  if (!Array.isArray(radii) || radii.length === 0) {
    console.error("Failed to generate sphere data");
    return null;
  }

  return (
    <group ref={sphereGroupRef}>
      {/* Eight nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => {
        // Validate radius
        const safeRadius = Math.max(0.1, Number(radius) || 1);
        
        // Compute material properties safely for each sphere
        const domain = philosophicalDomains?.[index % (philosophicalDomains?.length || 1)];
        
        // Safe color computation with fallbacks
        let baseColor = '#ffffff';
        if (domain && domain.color) {
          baseColor = domain.color;
        }
        
        // Color transition during animation
        if (safeProps.isUnraveling || safeProps.isUnraveled) {
          try {
            const beige = new THREE.Color('#f5f5dc');
            const turquoise = new THREE.Color('#40e0d0');
            const gradientColor = beige.clone().lerp(turquoise, safeProps.animationProgress);
            baseColor = `#${gradientColor.getHexString()}`;
          } catch (error) {
            console.error("Error creating gradient color:", error);
            baseColor = '#40e0d0';
          }
        }
        
        // Convert to safe hex numbers
        let colorHex = 0xffffff;
        let specularHex = 0x222222;
        let emissiveHex = 0x111111;
        
        try {
          const baseColorObj = new THREE.Color(baseColor);
          colorHex = baseColorObj.getHex();
          
          const specularColor = baseColorObj.clone().multiplyScalar(0.5);
          specularHex = specularColor.getHex();
          
          const emissiveColor = baseColorObj.clone().multiplyScalar(0.1);
          emissiveHex = emissiveColor.getHex();
        } catch (error) {
          console.error("Error computing material properties:", error);
          // Use defaults already set
        }
        
        const opacity = (safeProps.isUnraveling || safeProps.isUnraveled) ? 0.6 : 0.7;
        
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
                ref={(materialInstance) => {
                  if (materialInstance && materialsRef.current) {
                    materialsRef.current[index] = materialInstance;
                  }
                }}
                color={colorHex}
                specular={specularHex}
                emissive={emissiveHex}
                transparent={true}
                opacity={opacity}
                shininess={40}
              />
            </Sphere>
            {/* Add sacred geometry patterns to each sphere (hide during animation) */}
            {!safeProps.isUnraveling && !safeProps.isUnraveled && (
              <SacredGeometryPatterns radius={safeRadius} />
            )}
          </group>
        );
      })}
    </group>
  );
};
