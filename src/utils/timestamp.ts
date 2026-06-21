import { Timestamp } from 'firebase/firestore';

/**
 * Represents a Firestore-compatible timestamp value.
 * Covers Firestore Timestamp objects, JS Dates, and raw date strings/numbers.
 */
export type FirebaseTimestampLike =
  | Timestamp
  | Date
  | { toMillis: () => number }
  | { toDate: () => Date }
  | string
  | number
  | null
  | undefined;

/**
 * Converts a Firestore-compatible timestamp into epoch milliseconds.
 * Handles Firestore Timestamp, Date, duck-typed objects, and raw string/number values.
 */
export function toMillis(ts: FirebaseTimestampLike): number {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.toMillis();
  if (ts instanceof Date) return ts.getTime();
  if (typeof ts === 'object' && 'toMillis' in ts && typeof ts.toMillis === 'function') {
    return ts.toMillis();
  }
  if (typeof ts === 'object' && 'toDate' in ts && typeof ts.toDate === 'function') {
    return ts.toDate().getTime();
  }
  return new Date(ts as string | number).getTime();
}

/**
 * Formats a Firestore-compatible timestamp into a human-readable locale string.
 */
export function formatTimestamp(ts: FirebaseTimestampLike): string {
  if (!ts) return '';

  let date: Date;
  if (ts instanceof Date) {
    date = ts;
  } else if (ts instanceof Timestamp) {
    date = ts.toDate();
  } else if (typeof ts === 'object' && 'toDate' in ts && typeof ts.toDate === 'function') {
    date = ts.toDate();
  } else {
    date = new Date(ts as string | number);
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
