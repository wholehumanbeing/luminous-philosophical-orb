
export interface Philosopher {
  id: string;
  name: string;
  domain: string;
  era: number; // Year (negative for BCE)
  position: [number, number, number]; // 3D coordinates
  bio: string;
}

export const philosophers: Philosopher[] = [
  {
    id: "socrates",
    name: "Socrates",
    domain: "Ethics",
    era: -399,
    position: [8, 4, 2],
    bio: "Ancient Greek philosopher known for the Socratic method and ethical inquiry."
  },
  {
    id: "plato",
    name: "Plato",
    domain: "Metaphysics", 
    era: -347,
    position: [6, -3, 5],
    bio: "Student of Socrates, founded the Academy and developed theory of Forms."
  },
  {
    id: "aristotle",
    name: "Aristotle",
    domain: "Logic",
    era: -322,
    position: [-4, 2, 7],
    bio: "Student of Plato, founded formal logic and systematic philosophy."
  },
  {
    id: "kant",
    name: "Immanuel Kant",
    domain: "Ethics",
    era: 1804,
    position: [3, 6, -4],
    bio: "German philosopher who developed categorical imperative and transcendental idealism."
  },
  {
    id: "nietzsche",
    name: "Friedrich Nietzsche",
    domain: "Aesthetics",
    era: 1900,
    position: [-2, -5, 3],
    bio: "German philosopher known for critique of traditional morality and 'will to power'."
  }
];
