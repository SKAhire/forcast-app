import { format, differenceInDays } from "date-fns";

export function formatDateForDisplay(
  date: Date,
  start: Date,
  end: Date,
): string {
  const daysDiff = differenceInDays(end, start);

  if (daysDiff <= 1) {
    return format(date, "HH:mm");
  } else if (daysDiff <= 7) {
    return format(date, "EEE HH:mm");
  } else {
    return format(date, "MMM dd");
  }
}

export function formatDateTimeForInput(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function formatISO(date: Date): string {
  return date.toISOString();
}
