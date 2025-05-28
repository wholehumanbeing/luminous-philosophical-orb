
// Golden ratio and sacred geometry constants
export const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618
export const PHI_INVERSE = 1 / PHI; // ≈ 0.618

// Calculate golden ratio based sphere radii
export const getSphereRadii = (baseRadius: number = 2) => {
  return [
    baseRadius * PHI * PHI, // Outermost sphere
    baseRadius * PHI,       // Second sphere
    baseRadius,             // Center sphere
    baseRadius * PHI_INVERSE, // Fourth sphere
    baseRadius * PHI_INVERSE * PHI_INVERSE // Innermost sphere
  ];
};

// Philosophical domains with their vertical slice angles
export const philosophicalDomains = [
  {
    name: "Ethics",
    description: "The study of moral principles and values",
    color: "#d4af37", // Gold
    startAngle: 0,
    endAngle: Math.PI * 2 / 5
  },
  {
    name: "Aesthetics", 
    description: "The philosophy of beauty and artistic expression",
    color: "#4a6b6b", // Teal
    startAngle: Math.PI * 2 / 5,
    endAngle: Math.PI * 4 / 5
  },
  {
    name: "Logic",
    description: "The principles of valid reasoning and inference",
    color: "#c0c0c0", // Silver
    startAngle: Math.PI * 4 / 5,
    endAngle: Math.PI * 6 / 5
  },
  {
    name: "Politics",
    description: "The theory and practice of governance and society",
    color: "#b8941f", // Muted gold
    startAngle: Math.PI * 6 / 5,
    endAngle: Math.PI * 8 / 5
  },
  {
    name: "Metaphysics",
    description: "The fundamental nature of reality and existence",
    color: "#5a7a7a", // Misty teal
    startAngle: Math.PI * 8 / 5,
    endAngle: Math.PI * 2
  }
];

// Generate points for sacred geometry patterns
export const generatePentagon = (radius: number) => {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    points.push([
      radius * Math.cos(angle),
      radius * Math.sin(angle),
      0
    ]);
  }
  return points;
};

export const generateGoldenSpiral = (turns: number = 2, points: number = 100) => {
  const spiralPoints = [];
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * turns * Math.PI * 2;
    const r = Math.pow(PHI, t / (Math.PI / 2));
    spiralPoints.push([
      r * Math.cos(t) * 0.1,
      r * Math.sin(t) * 0.1,
      t * 0.05
    ]);
  }
  return spiralPoints;
};
