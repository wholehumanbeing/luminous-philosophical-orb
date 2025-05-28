
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
      const maxHeight = 60;
      
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

  // Compute safe material properties for each sphere
  const materialProps = useMemo(() => {
    console.log("Computing material props", { radii: radii.length, philosophicalDomains: philosophicalDomains.length });
    
    return radii.map((_, index) => {
      // Safe domain access with fallback
      const domain = philosophicalDomains[index % philosophicalDomains.length];
      const baseColor = domain?.color || '#40e0d0';
      
      let finalColor = baseColor;
      
      // Handle color transition during animation
      if (isUnraveling || isUnraveled) {
        try {
          const beige = new THREE.Color('#f5f5dc');
          const turquoise = new THREE.Color('#40e0d0');
          const gradientColor = beige.clone().lerp(turquoise, animationProgress);
          finalColor = `#${gradientColor.getHexString()}`;
        } catch (error) {
          console.error("Error creating gradient color:", error);
          finalColor = '#40e0d0';
        }
      }
      
      // Convert to safe hex numbers with guaranteed fallbacks
      let colorHex = 0x40e0d0;
      let specularHex = 0x222222;
      let emissiveHex = 0x111111;
      
      try {
        const baseColorObj = new THREE.Color(finalColor);
        colorHex = baseColorObj.getHex();
        specularHex = new THREE.Color(baseColorObj.clone().multiplyScalar(0.5)).getHex();
        emissiveHex = new THREE.Color(baseColorObj.clone().multiplyScalar(0.1)).getHex();
      } catch (error) {
        console.error("Error computing color hex values:", error);
        // Use safe defaults
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
  }, [radii.length, isUnraveling, isUnraveled, animationProgress]);

  console.log("Material props computed:", materialProps.length);

  if (radii.length === 0) {
    console.error("No radii generated");
    return null;
  }

  return (
    <group ref={sphereGroupRef}>
      {radii.map((radius, index) => {
        // Safe material access with guaranteed fallback
        const material = materialProps[index] || {
          color: 0x40e0d0,
          specular: 0x222222,
          emissive: 0x111111,
          transparent: true,
          opacity: 0.7,
          shininess: 40
        };
        
        console.log(`Rendering sphere ${index} with material:`, material);
        
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
                ref={(materialRef) => {
                  if (materialRef) materialsRef.current[index] = materialRef;
                }}
                color={material.color}
                specular={material.specular}
                emissive={material.emissive}
                transparent={material.transparent}
                opacity={material.opacity}
                shininess={material.shininess}
              />
            </Sphere>
            {!isUnraveling && !isUnraveled && (
              <SacredGeometryPatterns radius={radius} />
            )}
          </group>
        );
      })}
    </group>
  );
};
