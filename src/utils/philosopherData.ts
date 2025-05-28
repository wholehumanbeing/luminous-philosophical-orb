
export interface Philosopher {
  id: string;
  name: string;
  domain: string;
  era: number; // Year (negative for BCE)
  position: [number, number, number]; // 3D coordinates
  bio: string;
  detailedBio: string;
  domainStrengths: {
    ethics: number;
    aesthetics: number;
    logic: number;
    politics: number;
    metaphysics: number;
  };
  spiralDynamicsColor: string;
  portraitUrl?: string;
}

export const philosophers: Philosopher[] = [
  {
    id: "socrates",
    name: "Socrates",
    domain: "Ethics",
    era: -399,
    position: [8, 4, 2],
    bio: "Ancient Greek philosopher known for the Socratic method and ethical inquiry.",
    detailedBio: "Socrates was a classical Greek philosopher credited as the founder of Western philosophy and among the first moral philosophers of the ethical tradition of thought. He emphasized the importance of examining one's life and beliefs through rigorous questioning. His method of inquiry, known as the Socratic method, involves asking probing questions to expose contradictions in one's thinking and to guide toward truth.",
    domainStrengths: {
      ethics: 95,
      aesthetics: 20,
      logic: 85,
      politics: 60,
      metaphysics: 70
    },
    spiralDynamicsColor: "#4169E1",
    portraitUrl: "/placeholder.svg"
  },
  {
    id: "plato",
    name: "Plato",
    domain: "Metaphysics", 
    era: -347,
    position: [6, -3, 5],
    bio: "Student of Socrates, founded the Academy and developed theory of Forms.",
    detailedBio: "Plato was an ancient Greek philosopher born in Athens during the Classical period. A student of Socrates and teacher of Aristotle, he founded the Academy in Athens, one of the first institutions of higher learning in the Western world. His theory of Forms posits that beyond our physical world lies a realm of perfect, eternal forms or ideas that serve as the true reality behind all physical manifestations.",
    domainStrengths: {
      ethics: 80,
      aesthetics: 75,
      logic: 90,
      politics: 85,
      metaphysics: 100
    },
    spiralDynamicsColor: "#8A2BE2",
    portraitUrl: "/placeholder.svg"
  },
  {
    id: "aristotle",
    name: "Aristotle",
    domain: "Logic",
    era: -322,
    position: [-4, 2, 7],
    bio: "Student of Plato, founded formal logic and systematic philosophy.",
    detailedBio: "Aristotle was a Greek philosopher and polymath during the Classical period in Ancient Greece. As the founder of the Peripatetic school of philosophy in the Lyceum in Athens, he began the wider Aristotelian tradition that followed, which set the groundwork for the development of modern science. His writings cover many subjects including physics, biology, zoology, metaphysics, logic, ethics, aesthetics, poetry, theatre, music, rhetoric, psychology, linguistics, economics, politics, and government.",
    domainStrengths: {
      ethics: 85,
      aesthetics: 70,
      logic: 100,
      politics: 90,
      metaphysics: 95
    },
    spiralDynamicsColor: "#228B22",
    portraitUrl: "/placeholder.svg"
  },
  {
    id: "kant",
    name: "Immanuel Kant",
    domain: "Ethics",
    era: 1804,
    position: [3, 6, -4],
    bio: "German philosopher who developed categorical imperative and transcendental idealism.",
    detailedBio: "Immanuel Kant was a German philosopher and one of the central Enlightenment thinkers. His comprehensive and systematic works in epistemology, metaphysics, ethics, and aesthetics have made him one of the most influential figures in modern Western philosophy. His categorical imperative provides a foundation for moral law based on reason rather than emotion or religious doctrine.",
    domainStrengths: {
      ethics: 100,
      aesthetics: 80,
      logic: 95,
      politics: 70,
      metaphysics: 90
    },
    spiralDynamicsColor: "#FF6347",
    portraitUrl: "/placeholder.svg"
  },
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    domain: "Aesthetics",
    era: 1900,
    position: [-2, -5, 3],
    bio: "German philosopher known for critique of traditional morality and 'will to power'.",
    detailedBio: "Friedrich Nietzsche was a German philosopher, cultural critic, composer, poet, writer, and philologist whose work has exerted a profound influence on modern intellectual history. His critiques of traditional European morality and religion, as well as his concepts of the 'will to power' and the 'Übermensch', challenged conventional thinking and laid groundwork for existentialism and postmodernism.",
    domainStrengths: {
      ethics: 60,
      aesthetics: 100,
      logic: 75,
      politics: 40,
      metaphysics: 85
    },
    spiralDynamicsColor: "#FF4500",
    portraitUrl: "/placeholder.svg"
  }
];
