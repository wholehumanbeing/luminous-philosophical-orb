
interface DomainChartProps {
  domainStrengths: {
    ethics: number;
    aesthetics: number;
    logic: number;
    politics: number;
    metaphysics: number;
  };
}

export const DomainChart = ({ domainStrengths }: DomainChartProps) => {
  const domains = [
    { name: 'Ethics', value: domainStrengths.ethics, color: '#D4AF37' },
    { name: 'Aesthetics', value: domainStrengths.aesthetics, color: '#4A6B6B' },
    { name: 'Logic', value: domainStrengths.logic, color: '#E6F3FF' },
    { name: 'Politics', value: domainStrengths.politics, color: '#1A1B3A' },
    { name: 'Metaphysics', value: domainStrengths.metaphysics, color: '#C0C0C0' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-cosmic-gold font-serif text-sm mb-3">Domain Strengths</h4>
      {domains.map((domain) => (
        <div key={domain.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-cosmic-silver">{domain.name}</span>
            <span className="text-cosmic-ethereal-glow">{domain.value}%</span>
          </div>
          <div className="w-full bg-cosmic-indigo/30 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${domain.value}%`,
                backgroundColor: domain.color,
                opacity: 0.8
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
