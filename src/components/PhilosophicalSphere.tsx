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
  const materialsRef = useRef<THREE.Material[]>([]);
  const radii = useMemo(() => getSphereRadii(10), []);

  // Initialize sphere refs array
  useEffect(() => {
    sphereRefs.current = Array(radii.length).fill(null);
    
    // Clean up materials on unmount
    return () => {
      materialsRef.current.forEach(material => {
        if (material) material.dispose();
      });
    };
  }, [radii.length]);

  // Gentle rotation animation (disabled during unraveling)
  useFrame((state) => {
    if (!sphereGroupRef.current || !state.clock || isUnraveling || isUnraveled) return;
    
    try {
      sphereGroupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      sphereGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    } catch (error) {
      console.error("Error updating sphere rotation:", error);
    }
  });

  // Animation effect for sphere transformation
  useEffect(() => {
    if (!isUnraveling || sphereRefs.current.length === 0) return;
    
    try {
      const maxHeight = 60; // 80% of viewport height approximation
      
      sphereRefs.current.forEach((sphere, index) => {
        if (!sphere) return;
        
        const targetPosition = calculateHelixPosition(
          radii[index],
          index,
          radii.length,
          animationProgress,
          maxHeight
        );
        
        sphere.position.lerp(targetPosition, 0.1);
      });
    } catch (error) {
      console.error("Error animating sphere transformation:", error);
    }
  }, [animationProgress, isUnraveling, radii]);

  // Compute material properties for each sphere with safe defaults
  const sphereMaterials = useMemo(() => {
    try {
      return radii.map((_, index) => {
        const domain = philosophicalDomains[index % philosophicalDomains.length];
        
        // Color transition during animation
        let baseColor = domain?.color || '#ffffff'; // Default to white if domain color not found
        let colorHex = 0x40e0d0; // Default turquoise hex
        let specularHex = 0x222222;
        let emissiveHex = 0x111111;
        
        if (isUnraveling || isUnraveled) {
          try {
            const beige = new THREE.Color('#f5f5dc');
            const turquoise = new THREE.Color('#40e0d0');
            const gradientColor = beige.clone().lerp(turquoise, animationProgress);
            baseColor = `#${gradientColor.getHexString()}`;
          } catch (error) {
            console.error("Error creating gradient color:", error);
            baseColor = '#40e0d0'; // Fallback to turquoise
          }
        }
        
        // Convert to safe hex numbers
        try {
          const baseColorObj = new THREE.Color(baseColor);
          colorHex = baseColorObj.getHex();
          specularHex = new THREE.Color(baseColorObj.clone().multiplyScalar(0.5).getHexString()).getHex();
          emissiveHex = new THREE.Color(baseColorObj.clone().multiplyScalar(0.1).getHexString()).getHex();
        } catch (error) {
          console.error("Error computing material properties:", error);
          // Use default values from above
        }
        
        return {
          color: colorHex,
          specular: specularHex,
          emissive: emissiveHex,
          transparent: true,
          opacity: isUnraveling || isUnraveled ? 0.6 : 0.7,
          shininess: 40
        };
      });
    } catch (error) {
      console.error("Error creating sphere materials:", error);
      return [];
    }
  }, [radii, isUnraveling, isUnraveled, animationProgress]);

  if (radii.length === 0 || sphereMaterials.length === 0) {
    console.error("Failed to generate sphere data");
    return null;
  }

  return (
    <group ref={sphereGroupRef}>
      {/* Eight nested spheres with golden ratio proportions */}
      {radii.map((radius, index) => {
        // Safely get material or use fallback
        const material = sphereMaterials[index] || {
          color: 0x222222,
          specular: 0x111111,
          emissive: 0x000000,
          transparent: true,
          opacity: 0.7,
          shininess: 40
        };
        
        return (
          <group key={index}>
            <Sphere
              ref={(ref) => {
                if (ref) sphereRefs.current[index] = ref;
              }}
              args={[radius, 72, 36]}
              position={[0, 0, 0]}
            >
              <meshPhongMaterial
                ref={(material) => {
                  if (material) materialsRef.current[index] = material;
                }}
                color={material.color}
                specular={material.specular}
                emissive={material.emissive}
                transparent={material.transparent}
                opacity={material.opacity}
                shininess={material.shininess}
              />
            </Sphere>
            {/* Add sacred geometry patterns to each sphere (hide during animation) */}
            {!isUnraveling && !isUnraveled && (
              <SacredGeometryPatterns radius={radius} />
            )}
          </group>
        );
      })}
    </group>
  );
};
