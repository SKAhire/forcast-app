interface HorizonSliderProps {
  value: number;
  onChange: (hours: number) => void;
}

export function HorizonSlider({ value, onChange }: HorizonSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Forecast horizon
        </label>
        <span className="text-sm font-semibold text-gray-900 tabular-nums">
          {value}h
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={48}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="
          w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-gray-200
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-gray-900
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          [&::-moz-range-thumb]:bg-gray-900
          [&::-moz-range-thumb]:cursor-pointer
        "
      />

      <div className="flex justify-between text-xs text-gray-400">
        <span>0h</span>
        <span>24h</span>
        <span>48h</span>
      </div>
    </div>
  );
}
