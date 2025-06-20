
import { Button } from './ui/button';

interface UnravelButtonProps {
  onUnravel: () => void;
  isUnraveling: boolean;
  isUnraveled: boolean;
}

export const UnravelButton = ({ onUnravel, isUnraveling, isUnraveled }: UnravelButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-10">
      <Button
        onClick={onUnravel}
        disabled={isUnraveling}
        className="rounded-2xl bg-cosmic-indigo hover:bg-cosmic-deep-indigo text-cosmic-ethereal-glow px-8 py-3 text-lg font-serif shadow-lg cosmic-glow border-2 border-cosmic-teal/30"
      >
        {isUnraveling ? 'Unraveling...' : isUnraveled ? 'Restore' : 'Unravel'}
      </Button>
    </div>
  );
};
