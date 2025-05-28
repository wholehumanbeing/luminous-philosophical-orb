
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { philosophers, Philosopher } from '../utils/philosopherData';

interface VertexMarkersProps {
  visible: boolean;
  timelineYear: number;
  onPhilosopherHover: (philosopher: Philosopher | null) => void;
  onPhilosopherClick: (philosopher: Philosopher) => void;
}

export const VertexMarkers = ({ visible, timelineYear, onPhilosopherHover, onPhilosopherClick }: VertexMarkersProps) => {
  const markersRef = useRef<THREE.Group>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Filter philosophers based on timeline
  const visiblePhilosophers = philosophers.filter(p => Math.abs(p.era) <= Math.abs(timelineYear));

  useFrame(() => {
    if (markersRef.current) {
      markersRef.current.rotation.y += 0.001;
    }
  });

  const handlePointerOver = (philosopher: Philosopher) => {
    setHoveredMarker(philosopher.id);
    onPhilosopherHover(philosopher);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredMarker(null);
    onPhilosopherHover(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (philosopher: Philosopher) => {
    onPhilosopherClick(philosopher);
  };

  if (!visible) return null;

  return (
    <group ref={markersRef}>
      {visiblePhilosophers.map((philosopher) => (
        <mesh
          key={philosopher.id}
          position={philosopher.position}
          onPointerOver={() => handlePointerOver(philosopher)}
          onPointerOut={handlePointerOut}
          onClick={() => handleClick(philosopher)}
        >
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshPhongMaterial
            color={hoveredMarker === philosopher.id ? '#ffffff' : '#f0f0f0'}
            transparent
            opacity={0.9}
            emissive={hoveredMarker === philosopher.id ? '#444444' : '#000000'}
          />
        </mesh>
      ))}
    </group>
  );
};
