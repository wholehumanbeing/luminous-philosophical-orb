
import { Slider } from './ui/slider';

interface TimelineSliderProps {
  value: number;
  onChange: (value: number) => void;
  visible: boolean;
}

export const TimelineSlider = ({ value, onChange, visible }: TimelineSliderProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-cosmic-indigo/90 backdrop-blur-md rounded-2xl p-6 min-w-96 border-2 border-cosmic-teal/30 cosmic-glow">
        <div className="flex items-center space-x-4">
          <span className="text-cosmic-silver text-sm font-serif">-600</span>
          <div className="flex-1">
            <Slider
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
              min={-600}
              max={2025}
              step={50}
              className="w-full"
            />
          </div>
          <span className="text-cosmic-silver text-sm font-serif">2025</span>
        </div>
        <div className="text-center mt-3">
          <span className="text-cosmic-gold text-sm font-serif ethereal-text">
            {Math.abs(value)} {value < 0 ? 'BCE' : 'CE'}
          </span>
        </div>
      </div>
    </div>
  );
};
