
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
  const spiralPoints = useMemo(() => {
    const points = generateGoldenSpiral(3, 120);
    return points.map(point => new THREE.Vector3(
      point[0] * radius * 0.8,
      point[1] * radius * 0.8,
      point[2] * radius * 0.1
    ));
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
    
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    return geometry;
  }, [radius]);

  // Generate Flower of Life pattern
  const flowerOfLifeLines = useMemo(() => {
    const lines = [];
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
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(geometry);
    });

    return lines;
  }, [radius]);

  return (
    <group>
      {/* Fibonacci Spiral */}
      <group ref={spiralRef}>
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(spiralPoints.flatMap(p => [p.x, p.y, p.z]))}
              count={spiralPoints.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#e6f3ff" transparent opacity={0.4} />
        </line>
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
        {flowerOfLifeLines.map((geometry, index) => (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial 
              color="#d4af37" 
              transparent 
              opacity={0.15}
              linewidth={1}
            />
          </line>
        ))}
      </group>
    </group>
  );
};
