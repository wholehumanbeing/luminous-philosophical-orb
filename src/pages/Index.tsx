
import { Universe } from "@/components/Universe";

const Index = () => {
  return (
    <div className="w-full h-screen relative">
      {/* Main philosophical sphere scene */}
      <Universe />
      
      {/* Ethereal title overlay */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <div className="text-center pt-8">
          <h1 className="text-4xl md:text-6xl font-serif text-cosmic-gold ethereal-text animate-fade-in">
            Philosophical Sphere
          </h1>
          <p className="text-cosmic-silver/80 font-light mt-2 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
            An exploration of wisdom through sacred geometry
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
