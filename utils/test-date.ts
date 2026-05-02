/**
 * Date utilities for tests.
 * Returns ISO datetime strings in the format expected by the date input
 * on shop.gogift.com (`yyyy-MM-ddTHH:mm`).
 */

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function toDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Returns a datetime N days in the future at the given hour.
 * Default: 7 days from now at 10:00.
 */
export function futureDate(daysAhead: number = 7, hour: number = 10): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  return toDateTimeLocal(date);
}

/**
 * Returns tomorrow at 10:00.
 */
export function tomorrow(hour: number = 10): string {
  return futureDate(1, hour);
}

/**
 * Returns a past date — useful for negative test scenarios.
 */
export function pastDate(daysBack: number = 1, hour: number = 10): string {
  return futureDate(-daysBack, hour);
}