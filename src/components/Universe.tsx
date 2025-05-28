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
import { PhilosopherDrawer } from './PhilosopherDrawer';
import { TimelineSlider } from './TimelineSlider';
import { Philosopher } from '../utils/philosopherData';

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-cosmic-gold font-serif text-2xl ethereal-text animate-cosmic-pulse">
      Manifesting the Philosophical Sphere...
    </div>
  </div>
);

// Error boundary for Canvas rendering issues
const CanvasErrorFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-cosmic-deep-indigo/90">
    <div className="text-cosmic-gold font-serif text-2xl ethereal-text text-center p-8">
      <p>Unable to render the philosophical sphere.</p>
      <p className="text-sm mt-4">Please ensure WebGL is enabled in your browser.</p>
    </div>
  </div>
);

export const Universe = () => {
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [isUnraveling, setIsUnraveling] = useState(false);
  const [isUnraveled, setIsUnraveled] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPhilosopher, setHoveredPhilosopher] = useState<Philosopher | null>(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timelineYear, setTimelineYear] = useState(2025);
  const [canvasError, setCanvasError] = useState(false);
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

  const handlePhilosopherClick = (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle canvas error
  const handleCanvasError = () => {
    setCanvasError(true);
    console.error("Canvas rendering error occurred");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Three.js Canvas with error handling */}
      {canvasError ? (
        <CanvasErrorFallback />
      ) : (
        <Suspense fallback={<LoadingFallback />}>
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
            onCreated={({ gl, scene }) => {
              try {
                // Ensure proper initialization
                if (!gl || !scene) {
                  console.error("Canvas creation failed - missing gl or scene");
                  handleCanvasError();
                  return;
                }
                // Additional setup if needed
                gl.setClearColor(0x000000, 0);
              } catch (error) {
                console.error("Error in Canvas onCreated:", error);
                handleCanvasError();
              }
            }}
            onError={(error) => {
              console.error("Canvas error:", error);
              handleCanvasError();
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
                fade={true}
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
                onPhilosopherClick={handlePhilosopherClick}
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
        </Suspense>
      )}

      {/* Philosopher tooltip */}
      <PhilosopherTooltip
        philosopher={hoveredPhilosopher}
        mousePosition={mousePosition}
      />

      {/* Philosopher detail drawer */}
      <PhilosopherDrawer
        philosopher={selectedPhilosopher}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
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
      {!isUnraveling && !isUnraveled && !canvasError && (
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
