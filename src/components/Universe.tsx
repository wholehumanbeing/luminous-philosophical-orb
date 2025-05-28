import { useState, Suspense, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { PhilosophicalSphere } from './PhilosophicalSphere';
import { CosmicLighting } from './CosmicLighting';
import { DomainOverlay } from './DomainOverlay';
import { UnravelButton } from './UnravelButton';
import { HelixFormation } from './HelixFormation';
import { VertexMarkers } from './VertexMarkers';
import { PhilosopherTooltip } from './PhilosopherTooltip';
import { TimelineSlider } from './TimelineSlider';
import { Philosopher } from '../utils/philosopherData';

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-cosmic-gold font-serif text-2xl ethereal-text animate-cosmic-pulse">
      Manifesting the Philosophical Sphere...
    </div>
  </div>
);

export const Universe = () => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [isUnraveling, setIsUnraveling] = useState(false);
  const [isUnraveled, setIsUnraveled] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPhilosopher, setHoveredPhilosopher] = useState<Philosopher | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timelineYear, setTimelineYear] = useState(2025);
  const animationRef = useRef<number>();

  const handleUnravel = useCallback(() => {
    if (isUnraveling) return;

    if (isUnraveled) {
      // Restore to sphere formation
      setIsUnraveling(true);
      setAnimationProgress(1);
      
      const startTime = Date.now();
      const duration = 5000; // 5 seconds
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Reverse the progress for restoration
        setAnimationProgress(1 - progress);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsUnraveling(false);
          setIsUnraveled(false);
          setAnimationProgress(0);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Unravel to helix formation
      setIsUnraveling(true);
      setAnimationProgress(0);
      
      const startTime = Date.now();
      const duration = 5000; // 5 seconds
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setAnimationProgress(progress);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsUnraveling(false);
          setIsUnraveled(true);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isUnraveling, isUnraveled]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas */}
      <Canvas
        camera={{
          position: [0, 0, 80],
          fov: 45,
          near: 0.1,
          far: 2000
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
            radius={200}
            depth={100}
            count={2000}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />
          
          {/* Lighting setup */}
          <CosmicLighting />
          
          {/* Main philosophical sphere or helix formation */}
          {isUnraveled && animationProgress === 1 ? (
            <HelixFormation 
              sphereCount={8} 
              animationProgress={animationProgress}
              maxHeight={60}
            />
          ) : (
            <PhilosophicalSphere 
              hoveredDomain={hoveredDomain}
              isUnraveling={isUnraveling}
              animationProgress={animationProgress}
              isUnraveled={isUnraveled}
            />
          )}

          {/* Vertex markers for philosophers */}
          <VertexMarkers
            visible={!isUnraveling && !isUnraveled}
            timelineYear={timelineYear}
            onPhilosopherHover={setHoveredPhilosopher}
          />
          
          {/* Interactive controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.5}
            rotateSpeed={0.3}
            panSpeed={0.5}
            minDistance={30}
            maxDistance={150}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>

      {/* Philosopher tooltip */}
      <PhilosopherTooltip
        philosopher={hoveredPhilosopher}
        mousePosition={mousePosition}
      />

      {/* Timeline slider */}
      <TimelineSlider
        value={timelineYear}
        onChange={setTimelineYear}
        visible={!isUnraveling && !isUnraveled}
      />

      {/* Unravel Button */}
      <UnravelButton
        onUnravel={handleUnravel}
        isUnraveling={isUnraveling}
        isUnraveled={isUnraveled}
      />

      {/* UI Overlay (hide during animation for clarity) */}
      {!isUnraveling && !isUnraveled && (
        <Suspense fallback={<LoadingFallback />}>
          <DomainOverlay
            hoveredDomain={hoveredDomain}
            onDomainHover={setHoveredDomain}
          />
        </Suspense>
      )}

      {/* Cosmic background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-cosmic-indigo/20 via-transparent to-cosmic-deep-indigo/40" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-cosmic-gold/10 rounded-full blur-3xl animate-gentle-float" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-cosmic-teal/10 rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};
