import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HelixFormationProps {
  sphereCount?: number;
  animationProgress?: number;
  maxHeight?: number;
}

export const HelixFormation = ({ 
  sphereCount = 8, 
  animationProgress = 0, 
  maxHeight = 60 
}: HelixFormationProps) => {
  const helixGroupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial | THREE.MeshBasicMaterial | null>(null);

  // Validate inputs with safe defaults
  const safeProps = useMemo(() => {
    return {
      sphereCount: Math.max(1, Math.min(sphereCount || 8, 20)),
      animationProgress: Math.max(0, Math.min(animationProgress || 0, 1)),
      maxHeight: Math.max(10, Math.min(maxHeight || 60, 200))
    };
  }, [sphereCount, animationProgress, maxHeight]);

  // Generate double helix positions with comprehensive error handling
  const helixPositions = useMemo(() => {
    try {
      if (!safeProps.sphereCount || safeProps.sphereCount <= 0) {
        console.warn("Invalid sphere count, using default");
        return [];
      }

      const positions = [];
      const heightStep = safeProps.maxHeight / safeProps.sphereCount;
      
      for (let i = 0; i < safeProps.sphereCount; i++) {
        const t = i / safeProps.sphereCount;
        const angle1 = t * Math.PI * 4; // First helix strand
        const angle2 = angle1 + Math.PI; // Second helix strand (180° offset)
        const y = (i - safeProps.sphereCount / 2) * heightStep;
        const radius = 8;
        
        // First strand
        const position1 = new THREE.Vector3(
          Math.cos(angle1) * radius,
          y,
          Math.sin(angle1) * radius
        );
        
        // Second strand
        const position2 = new THREE.Vector3(
          Math.cos(angle2) * radius,
          y,
          Math.sin(angle2) * radius
        );
        
        // Validate positions
        if (isNaN(position1.x) || isNaN(position1.y) || isNaN(position1.z)) {
          console.error(`Invalid position1 at index ${i}:`, position1);
          continue;
        }
        if (isNaN(position2.x) || isNaN(position2.y) || isNaN(position2.z)) {
          console.error(`Invalid position2 at index ${i}:`, position2);
          continue;
        }
        
        positions.push({
          position: position1,
          scale: Math.max(0.1, 1 - t * 0.3), // Ensure minimum scale
          key: `helix-1-${i}`
        });
        
        positions.push({
          position: position2,
          scale: Math.max(0.1, 1 - t * 0.3),
          key: `helix-2-${i}`
        });
      }
      
      return positions;
    } catch (error) {
      console.error("Error generating helix positions:", error);
      return [];
    }
  }, [safeProps]);

  // Create helix material with safe color handling
  const helixMaterial = useMemo(() => {
    try {
      // Safe color creation with fallbacks
      let finalColor = new THREE.Color('#40e0d0'); // Default turquoise
      
      try {
        const beige = new THREE.Color('#f5f5dc');
        const turquoise = new THREE.Color('#40e0d0');
        finalColor = beige.clone().lerp(turquoise, safeProps.animationProgress);
      } catch (colorError) {
        console.warn("Error creating gradient color, using default:", colorError);
        finalColor = new THREE.Color('#40e0d0');
      }
      
      const material = new THREE.MeshPhongMaterial({
        color: finalColor,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        side: THREE.DoubleSide
      });
      
      materialRef.current = material;
      return material;
    } catch (error) {
      console.error("Error creating helix material:", error);
      // Return a very basic fallback material
      const fallback = new THREE.MeshBasicMaterial({ 
        color: 0x40e0d0, 
        transparent: true, 
        opacity: 0.8 
      });
      materialRef.current = fallback;
      return fallback;
    }
  }, [safeProps.animationProgress]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      try {
        if (materialRef.current) {
          materialRef.current.dispose();
          materialRef.current = null;
        }
      } catch (error) {
        console.error("Error disposing material:", error);
      }
    };
  }, []);

  // Gentle rotation with comprehensive error handling
  useFrame((state) => {
    try {
      if (helixGroupRef.current && state && state.clock) {
        const elapsedTime = state.clock.elapsedTime;
        if (typeof elapsedTime === 'number' && !isNaN(elapsedTime)) {
          helixGroupRef.current.rotation.y = elapsedTime * 0.1;
        }
      }
    } catch (error) {
      console.error("Error updating helix rotation:", error);
    }
  });

  // Guard against empty or invalid positions
  if (!helixPositions || helixPositions.length === 0) {
    console.warn("No valid helix positions generated");
    return null;
  }

  return (
    <group ref={helixGroupRef}>
      {helixPositions.map((helix, index) => {
        // Additional validation for each helix object
        if (!helix || !helix.position || typeof helix.scale !== 'number') {
          console.warn(`Invalid helix data at index ${index}:`, helix);
          return null;
        }

        // Validate position values
        const { x, y, z } = helix.position;
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
          console.warn(`Invalid position values at index ${index}:`, helix.position);
          return null;
        }

        // Ensure scale is valid
        const scale = Math.max(0.1, Math.min(helix.scale, 2));
        
        try {
          return (
            <mesh
              key={helix.key || `helix-${index}`}
              position={[x, y, z]}
              scale={[scale, scale, scale]}
            >
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshPhongMaterial
                color={helixMaterial.color}
                transparent={true}
                opacity={0.8}
                shininess={100}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        } catch (meshError) {
          console.error(`Error creating mesh at index ${index}:`, meshError);
          return null;
        }
      })}
    </group>
  );
};
