
import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PhilosophicalSphere } from './PhilosophicalSphere';
import { CosmicLighting } from './CosmicLighting';
import { DomainOverlay } from './DomainOverlay';

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-cosmic-gold font-serif text-2xl ethereal-text animate-cosmic-pulse">
      Manifesting the Philosophical Sphere...
    </div>
  </div>
);

export const Universe = () => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 80], // Adjusted for larger spheres
          fov: 45,
          near: 0.1,
          far: 2000 // Increased far plane for larger scene
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          {/* Cosmic background */}
          <Stars
            radius={200} // Increased for larger scene
            depth={100}
            count={2000}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />
          
          {/* Lighting setup */}
          <CosmicLighting />
          
          {/* Main philosophical sphere */}
          <PhilosophicalSphere hoveredDomain={hoveredDomain} />
          
          {/* Interactive controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.3}
            panSpeed={0.5}
            minDistance={30} // Adjusted for larger spheres
            maxDistance={150}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <DomainOverlay
          hoveredDomain={hoveredDomain}
          onDomainHover={setHoveredDomain}
        />
      </Suspense>

      {/* Cosmic background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cosmic-indigo/20 via-transparent to-cosmic-deep-indigo/40" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cosmic-gold/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-cosmic-teal/10 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
