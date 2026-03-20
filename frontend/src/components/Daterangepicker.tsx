import type { DateRange } from "../types/types";

// datetime-local inputs operate on "YYYY-MM-DDTHH:mm" strings.
// These two helpers are the only place that format is ever touched —
// everything outside this component stays as Date objects.
function toInputValue(date: Date): string {
  // Slice off seconds and the trailing 'Z' — datetime-local doesn't want them
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

    // Don't silently allow an invalid range — clamp end to start if it would go backwards
    const newEnd = newStart > value.endTime ? newStart : value.endTime;

    onChange({ startTime: newStart, endTime: newEnd });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;

    const newEnd = fromInputValue(e.target.value);

    // Discard the change rather than producing an inverted range
    if (newEnd < value.startTime) return;

    onChange({ ...value, endTime: newEnd });
  };

  return (
    <div className="flex items-end gap-4">
      <DateTimeField
        label="Start time"
        value={toInputValue(value.startTime)}
        max={toInputValue(value.endTime)}
        onChange={handleStartChange}
      />

      <span className="mb-2 text-sm text-gray-400 select-none">→</span>

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

// Extracted so the label+input pairing isn't repeated inline twice above.
// Not exported — it's an implementation detail of this component.
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
    <div className="flex flex-col gap-1">
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
          rounded-md border border-gray-300 bg-white px-3 py-2
          text-sm text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
        "
      />
    </div>
  );
}
