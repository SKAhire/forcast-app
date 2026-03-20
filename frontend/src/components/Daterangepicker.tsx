import type { DateRange } from "../types";

function toInputValue(date: Date): string {
  return date.toISOString().slice(0, 16);
}

function fromInputValue(value: string): Date {
  return new Date(value);
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newStart = fromInputValue(e.target.value);
    const newEnd = newStart > value.endTime ? newStart : value.endTime;
    onChange({ startTime: newStart, endTime: newEnd });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newEnd = fromInputValue(e.target.value);
    if (newEnd < value.startTime) return;
    onChange({ ...value, endTime: newEnd });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <DateTimeField
        label="Start time"
        value={toInputValue(value.startTime)}
        max={toInputValue(value.endTime)}
        onChange={handleStartChange}
      />

      <span className="mb-2.5 text-xs text-gray-300 select-none">→</span>

      <DateTimeField
        label="End time"
        value={toInputValue(value.endTime)}
        min={toInputValue(value.startTime)}
        max={toInputValue(new Date())}
        onChange={handleEndChange}
      />
    </div>
  );
}

interface DateTimeFieldProps {
  label: string;
  value: string;
  min?: string;
  max?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function DateTimeField({
  label,
  value,
  min,
  max,
  onChange,
}: DateTimeFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      <input
        type="datetime-local"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className="
          rounded-lg border border-gray-200 bg-gray-50 px-3 py-2
          text-sm text-gray-900
          transition-colors duration-150
          hover:border-gray-300 hover:bg-white
          focus:outline-none focus:border-gray-400 focus:bg-white focus:ring-0
        "
      />
    </div>
  );
}
