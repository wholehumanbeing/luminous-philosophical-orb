
import { useState } from 'react';
import { philosophicalDomains } from '../utils/sacredGeometry';

interface DomainOverlayProps {
  hoveredDomain: string | null;
  onDomainHover: (domain: string | null) => void;
}

export const DomainOverlay = ({ hoveredDomain, onDomainHover }: DomainOverlayProps) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleDomainClick = (domainName: string) => {
    setSelectedDomain(selectedDomain === domainName ? null : domainName);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Domain selection panel */}
      <div className="absolute top-8 left-8 pointer-events-auto">
        <div className="bg-cosmic-indigo/80 backdrop-blur-sm rounded-lg p-6 cosmic-glow">
          <h2 className="text-2xl font-serif text-cosmic-gold mb-4 ethereal-text">
            Philosophical Domains
          </h2>
          <div className="space-y-3">
            {philosophicalDomains.map((domain) => (
              <div
                key={domain.name}
                className={`cursor-pointer transition-all duration-300 p-3 rounded-md ${
                  hoveredDomain === domain.name
                    ? 'bg-cosmic-gold/20 scale-105'
                    : selectedDomain === domain.name
                    ? 'bg-cosmic-teal/20'
                    : 'hover:bg-cosmic-misty-teal/10'
                }`}
                onMouseEnter={() => onDomainHover(domain.name)}
                onMouseLeave={() => onDomainHover(null)}
                onClick={() => handleDomainClick(domain.name)}
              >
                <h3 
                  className="font-serif text-lg ethereal-text"
                  style={{ color: domain.color }}
                >
                  {domain.name}
                </h3>
                <p className="text-sm text-cosmic-silver/80 font-light">
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected domain details */}
      {selectedDomain && (
        <div className="absolute bottom-8 right-8 pointer-events-auto">
          <div className="bg-cosmic-deep-indigo/90 backdrop-blur-sm rounded-lg p-6 cosmic-glow max-w-md">
            {(() => {
              const domain = philosophicalDomains.find(d => d.name === selectedDomain);
              if (!domain) return null;
              
              return (
                <>
                  <h3 
                    className="text-xl font-serif mb-3 ethereal-text"
                    style={{ color: domain.color }}
                  >
                    {domain.name}
                  </h3>
                  <p className="text-cosmic-ethereal-glow/90 font-light leading-relaxed">
                    {domain.description}
                  </p>
                  <div className="mt-4 text-xs text-cosmic-silver/60">
                    Sphere domain {philosophicalDomains.indexOf(domain) + 1} of 5
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Sacred geometry info */}
      <div className="absolute top-8 right-8 pointer-events-auto">
        <div className="bg-cosmic-indigo/60 backdrop-blur-sm rounded-lg p-4">
          <h3 className="text-sm font-serif text-cosmic-gold mb-2">Sacred Geometry</h3>
          <div className="text-xs text-cosmic-silver/80 space-y-1">
            <div>Golden Ratio: φ ≈ 1.618</div>
            <div>Nested spheres: 5 domains</div>
            <div>Proportional radii</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div className="bg-cosmic-deep-indigo/70 backdrop-blur-sm rounded-lg p-4">
          <div className="text-xs text-cosmic-silver/80 space-y-1">
            <div>• Click and drag to rotate</div>
            <div>• Scroll to zoom</div>
            <div>• Hover domains to explore</div>
          </div>
        </div>
      </div>
    </div>
  );
};
