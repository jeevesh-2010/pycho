import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

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
    return format(date, 'EEEE, MMM d, yyyy • h:mm:ss a');
  } catch {
    return isoString;
  }
}

export function formatCardTimestamp(isoString: string): { primary: string; secondary: string } {
  try {
    const date = parseISO(isoString);
    let primary = format(date, 'MMM d, yyyy • h:mm a');
    if (isToday(date)) {
      primary = `Today • ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      primary = `Yesterday • ${format(date, 'h:mm a')}`;
    }

    const secondary = formatDistanceToNow(date, { addSuffix: true });
    return { primary, secondary };
  } catch {
    return { primary: isoString, secondary: '' };
  }
}

export function formatFullDateHeader(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return format(date, 'MMMM d, yyyy');
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}
