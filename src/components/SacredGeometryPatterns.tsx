import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateGoldenSpiral } from '../utils/sacredGeometry';

interface SacredGeometryPatternsProps {
  radius: number;
}

export const SacredGeometryPatterns = ({ radius }: SacredGeometryPatternsProps) => {
  const spiralRef = useRef<THREE.Group>(null);
  const platonicPointsRef = useRef<THREE.Points>(null);
  const flowerLinesRef = useRef<THREE.Group>(null);

  // Gentle scrolling animation for the Fibonacci spiral
  useFrame((state) => {
    if (spiralRef.current) {
      spiralRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  // Generate Fibonacci spiral points
  const spiralGeometry = useMemo(() => {
    const points = generateGoldenSpiral(3, 120);
    const spiralPoints = points.map(point => new THREE.Vector3(
      point[0] * radius * 0.8,
      point[1] * radius * 0.8,
      point[2] * radius * 0.1
    ));
    return new THREE.BufferGeometry().setFromPoints(spiralPoints);
  }, [radius]);

  // Generate Platonic solid vertex markers (icosahedron vertices)
  const platonicVertices = useMemo(() => {
    const phi = (1 + Math.sqrt(5)) / 2;
    const vertices = [
      // Icosahedron vertices scaled to sphere radius
      [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
      [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
    ].map(v => new THREE.Vector3(
      v[0] * radius * 0.9 / Math.sqrt(1 + phi * phi),
      v[1] * radius * 0.9 / Math.sqrt(1 + phi * phi),
      v[2] * radius * 0.9 / Math.sqrt(1 + phi * phi)
    ));
    
    return new THREE.BufferGeometry().setFromPoints(vertices);
  }, [radius]);

  // Generate Flower of Life pattern
  const flowerOfLifeGeometries = useMemo(() => {
    const geometries = [];
    const circleRadius = radius * 0.2;
    const centers = [
      [0, 0, 0],
      [circleRadius * 1.5, 0, 0],
      [-circleRadius * 1.5, 0, 0],
      [circleRadius * 0.75, circleRadius * 1.3, 0],
      [-circleRadius * 0.75, circleRadius * 1.3, 0],
      [circleRadius * 0.75, -circleRadius * 1.3, 0],
      [-circleRadius * 0.75, -circleRadius * 1.3, 0]
    ];

    centers.forEach(center => {
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(
          center[0] + circleRadius * Math.cos(angle),
          center[1] + circleRadius * Math.sin(angle),
          center[2]
        ));
      }
      geometries.push(new THREE.BufferGeometry().setFromPoints(points));
    });

    return geometries;
  }, [radius]);

  // Create materials separately to avoid recreation on each render
  const spiralMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({ 
      color: "#e6f3ff", 
      transparent: true, 
      opacity: 0.4 
    })
  , []);
  
  const pointsMaterial = useMemo(() =>
    new THREE.PointsMaterial({
      color: "#f8f8ff",
      size: 0.8,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: false
    })
  , []);
  
  const flowerMaterial = useMemo(() =>
    new THREE.LineBasicMaterial({
      color: "#d4af37",
      transparent: true,
      opacity: 0.15
    })
  , []);

  // Create Three.js objects for lines directly
  const spiralLine = useMemo(() => {
    return new THREE.Line(spiralGeometry, spiralMaterial);
  }, [spiralGeometry, spiralMaterial]);

  const flowerLines = useMemo(() => {
    return flowerOfLifeGeometries.map((geometry, index) => 
      new THREE.Line(geometry, flowerMaterial)
    );
  }, [flowerOfLifeGeometries, flowerMaterial]);

  return (
    <group>
      {/* Fibonacci Spiral */}
      <group ref={spiralRef}>
        <primitive object={spiralLine} />
      </group>

      {/* Platonic Solid Vertex Markers */}
      <points ref={platonicPointsRef} geometry={platonicVertices}>
        <pointsMaterial 
          color="#f8f8ff" 
          size={0.8} 
          transparent 
          opacity={0.8}
          sizeAttenuation={false}
        />
      </points>

      {/* Flower of Life Pattern */}
      <group ref={flowerLinesRef}>
        {flowerLines.map((line, index) => (
          <primitive key={index} object={line} />
        ))}
      </group>
    </group>
  );
};
