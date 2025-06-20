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
    
    // CONSOLE LOG DEBUG: Animation useEffect trigger and inputs
    console.log('[PhilosophicalSphere] Animation useEffect triggered. isUnraveling:', safeProps.isUnraveling, 'animationProgress:', safeProps.animationProgress, 'radii:', JSON.stringify(radii));

    try {
      const maxHeight = 60;
      
      sphereRefs.current.forEach((sphere, index) => {
        if (!sphere || !sphere.position) return;
        
        try {
          // CONSOLE LOG DEBUG: Inputs to calculateHelixPosition
          console.log('[PhilosophicalSphere] Calculating helix position for sphere index:', index, 'radius:', radii[index], 'animationProgress:', safeProps.animationProgress, 'radii length:', radii.length, 'maxHeight:', maxHeight);
          const targetPosition = calculateHelixPosition(
            radii[index] || 1,
            index,
            radii.length,
            safeProps.animationProgress,
            maxHeight
          );
          
          // CONSOLE LOG DEBUG: Output of calculateHelixPosition
          console.log('[PhilosophicalSphere] Calculated targetPosition for sphere index:', index, JSON.stringify(targetPosition));

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

  // Compute material properties for each sphere with comprehensive error handling
  const sphereMaterials = useMemo(() => {
    try {
      if (!Array.isArray(radii) || radii.length === 0) {
        console.warn("Invalid radii array");
        // CONSOLE LOG DEBUG: sphereMaterials memo - invalid radii
        console.log('[PhilosophicalSphere] sphereMaterials: Invalid radii array:', JSON.stringify(radii));
        return [];
      }

      // CONSOLE LOG DEBUG: sphereMaterials memo - calculation inputs
      console.log('[PhilosophicalSphere] sphereMaterials: Calculating materials. radii:', JSON.stringify(radii), 'isUnraveling:', safeProps.isUnraveling, 'isUnraveled:', safeProps.isUnraveled, 'animationProgress:', safeProps.animationProgress);

      return radii.map((_, index) => {
        try {
          const domain = philosophicalDomains?.[index % (philosophicalDomains?.length || 1)];
          // CONSOLE LOG DEBUG: sphereMaterials map - domain
          console.log('[PhilosophicalSphere] sphereMaterials map - index:', index, 'domain:', JSON.stringify(domain));
          
          // Safe color handling with multiple fallbacks
          let baseColor = '#ffffff'; // Ultimate fallback
          let colorHex = 0xffffff;
          let specularHex = 0x222222;
          let emissiveHex = 0x111111;
          
          // Try to get domain color
          if (domain && domain.color) {
            baseColor = domain.color;
          }
          
          // Color transition during animation with error handling
          if (safeProps.isUnraveling || safeProps.isUnraveled) {
            try {
              const beige = new THREE.Color('#f5f5dc');
              const turquoise = new THREE.Color('#40e0d0');
              const gradientColor = beige.clone().lerp(turquoise, safeProps.animationProgress);
              baseColor = `#${gradientColor.getHexString()}`;
            } catch (error) {
              console.error("Error creating gradient color:", error);
              baseColor = '#40e0d0'; // Fallback to turquoise
            }
          }
          
          // Convert to safe hex numbers with error handling
          try {
            const baseColorObj = new THREE.Color(baseColor);
            colorHex = baseColorObj.getHex();
            
            const specularColor = baseColorObj.clone().multiplyScalar(0.5);
            specularHex = specularColor.getHex();
            
            const emissiveColor = baseColorObj.clone().multiplyScalar(0.1);
            emissiveHex = emissiveColor.getHex();
          } catch (error) {
            console.error("Error computing material properties:", error);
            // Use default values already set above
          }
          
          return {
            color: colorHex,
            specular: specularHex,
            emissive: emissiveHex,
            transparent: true,
            opacity: (safeProps.isUnraveling || safeProps.isUnraveled) ? 0.6 : 0.7,
            shininess: 40
          };
        } catch (error) {
          console.error(`Error creating material for sphere ${index}:`, error);
          return {
            color: 0xffffff,
            specular: 0x222222,
            emissive: 0x111111,
            transparent: true,
            opacity: 0.7,
            shininess: 40
          };
        }
      });
    } catch (error) {
      console.error("Error creating sphere materials:", error);
      return [];
    }
  }, [radii, safeProps.isUnraveling, safeProps.isUnraveled, safeProps.animationProgress]);

  // Guard against invalid data
  if (!Array.isArray(radii) || radii.length === 0 || !Array.isArray(sphereMaterials) || sphereMaterials.length === 0) {
    console.error("Failed to generate sphere data");
    // CONSOLE LOG DEBUG: Guard triggered for invalid data
    console.log('[PhilosophicalSphere] Guard: Failed to generate sphere data. radii:', JSON.stringify(radii), 'sphereMaterials:', JSON.stringify(sphereMaterials));
    return null;
  }

  // CONSOLE LOG DEBUG: Props before main render
  console.log('[PhilosophicalSphere] Rendering. radii:', JSON.stringify(radii));
  console.log('[PhilosophicalSphere] Rendering. sphereMaterials:', JSON.stringify(sphereMaterials, null, 2));

  return (
    <group ref={sphereGroupRef}>
      {/* Eight nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => {
        // Validate radius
        const safeRadius = Math.max(0.1, Number(radius) || 1);
        
        // CONSOLE LOG DEBUG: Inside radii.map - radius values
        console.log('[PhilosophicalSphere] Mapping radii - index:', index, 'original radius:', radius, 'safeRadius:', safeRadius);

        // Safely get material or use fallback
        const materialProps = sphereMaterials[index] || {
          color: 0xffffff,
          specular: 0x222222,
          emissive: 0x111111,
          transparent: true,
          opacity: 0.7,
          shininess: 40
        };
        
        // CONSOLE LOG DEBUG: Inside radii.map - material props
        console.log('[PhilosophicalSphere] Mapping radii - index:', index, 'materialProps:', JSON.stringify(materialProps, null, 2));
        
        try {
          // CONSOLE LOG DEBUG: Props for <Sphere> and <meshPhongMaterial>
          const sphereArgs: [number, number, number] = [safeRadius, 72, 36];
          const spherePosition: [number, number, number] = [0,0,0]; // Assuming static position for now, or log calculated if dynamic
          console.log('[PhilosophicalSphere] Sphere props for index', index, 'args:', JSON.stringify(sphereArgs), 'position:', JSON.stringify(spherePosition) );
          console.log('[PhilosophicalSphere] meshPhongMaterial props for index', index, ':', JSON.stringify(materialProps, null, 2));

          return (
            <group key={`sphere-group-${index}`}>
              <Sphere
                ref={(ref) => {
                  if (ref && sphereRefs.current) {
                    sphereRefs.current[index] = ref;
                  }
                }}
                args={sphereArgs}
                position={spherePosition}
              >
                <meshPhongMaterial
                  ref={(materialInstance) => {
                    if (materialInstance && materialsRef.current) {
                      materialsRef.current[index] = materialInstance;
                    }
                  }}
                  color={materialProps.color}
                  specular={materialProps.specular}
                  emissive={materialProps.emissive}
                  transparent={materialProps.transparent}
                  opacity={materialProps.opacity}
                  shininess={materialProps.shininess}
                />
              </Sphere>
              {/* Add sacred geometry patterns to each sphere (hide during animation) */}
              {!safeProps.isUnraveling && !safeProps.isUnraveled && (
                <SacredGeometryPatterns radius={safeRadius} />
              )}
            </group>
          );
        } catch (error) {
          console.error(`Error creating sphere ${index}:`, error);
          return null;
        }
      })}
    </group>
  );
};
