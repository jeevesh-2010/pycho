import { format, parseISO } from 'date-fns';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatExactTimestamp(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, 'd MMMM, EEEE • h:mm:ss a');
  } catch {
    return isoString;
  }
}

export function formatCardTimestamp(isoString: string): { primary: string; secondary: string } {
  try {
    const date = parseISO(isoString);
    // Formats like "18 December, Monday • 5:15 PM" without relative verbs like today/yesterday
    const dateAndDay = format(date, 'd MMMM, EEEE');
    const timeString = format(date, 'h:mm a');
    return { primary: `${dateAndDay} • ${timeString}`, secondary: timeString };
  } catch {
    return { primary: isoString, secondary: '' };
  }
}

export function formatFullDateHeader(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return format(date, 'd MMMM, EEEE');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
