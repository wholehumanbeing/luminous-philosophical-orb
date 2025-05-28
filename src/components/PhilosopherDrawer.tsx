
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { DomainChart } from './DomainChart';
import { Philosopher } from '../utils/philosopherData';

interface PhilosopherDrawerProps {
  philosopher: Philosopher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhilosopherDrawer = ({ philosopher, open, onOpenChange }: PhilosopherDrawerProps) => {
  if (!philosopher) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] bg-cosmic-deep-indigo/95 backdrop-blur-sm border-cosmic-indigo text-cosmic-ethereal-glow">
        <SheetHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={philosopher.portraitUrl} alt={philosopher.name} />
              <AvatarFallback className="bg-cosmic-indigo text-cosmic-gold font-serif text-lg">
                {philosopher.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className="text-cosmic-gold font-serif text-xl">
                {philosopher.name}
              </SheetTitle>
              <p className="text-cosmic-silver text-sm">{philosopher.domain}</p>
              <p className="text-cosmic-ethereal-glow text-xs">
                {Math.abs(philosopher.era)} {philosopher.era < 0 ? 'BCE' : 'CE'}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Spiral Dynamics Color */}
          <div>
            <h4 className="text-cosmic-gold font-serif text-sm mb-2">Spiral Dynamics</h4>
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-full border border-cosmic-silver/30"
                style={{ backgroundColor: philosopher.spiralDynamicsColor }}
              />
              <span className="text-cosmic-silver text-sm">
                {philosopher.spiralDynamicsColor}
              </span>
            </div>
          </div>

          <Separator className="bg-cosmic-indigo/50" />

          {/* Biography */}
          <div>
            <h4 className="text-cosmic-gold font-serif text-sm mb-3">Biography</h4>
            <p className="text-cosmic-ethereal-glow text-sm leading-relaxed">
              {philosopher.detailedBio}
            </p>
          </div>

          <Separator className="bg-cosmic-indigo/50" />

          {/* Domain Strengths Chart */}
          <DomainChart domainStrengths={philosopher.domainStrengths} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
