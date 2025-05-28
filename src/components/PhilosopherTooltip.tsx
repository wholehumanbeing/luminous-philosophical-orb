
import { useState, useEffect } from 'react';
import { Philosopher } from '../utils/philosopherData';

interface PhilosopherTooltipProps {
  philosopher: Philosopher | null;
  mousePosition: { x: number; y: number };
}

export const PhilosopherTooltip = ({ philosopher, mousePosition }: PhilosopherTooltipProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (philosopher) {
      setPosition({
        x: mousePosition.x + 10,
        y: mousePosition.y - 10
      });
    }
  }, [philosopher, mousePosition]);

  if (!philosopher) return null;

  return (
    <div
      className="fixed pointer-events-none z-20 bg-cosmic-deep-indigo/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(0, -100%)'
      }}
    >
      <h3 className="text-cosmic-gold font-serif text-lg mb-1">{philosopher.name}</h3>
      <p className="text-cosmic-silver text-sm mb-1">{philosopher.domain}</p>
      <p className="text-cosmic-ethereal-glow text-xs">
        {Math.abs(philosopher.era)} {philosopher.era < 0 ? 'BCE' : 'CE'}
      </p>
    </div>
  );
};
