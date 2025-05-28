
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
      <div className="bg-cosmic-indigo/80 backdrop-blur-sm rounded-lg p-4 min-w-96">
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
        <div className="text-center mt-2">
          <span className="text-cosmic-gold text-sm font-serif">
            {Math.abs(value)} {value < 0 ? 'BCE' : 'CE'}
          </span>
        </div>
      </div>
    </div>
  );
};
