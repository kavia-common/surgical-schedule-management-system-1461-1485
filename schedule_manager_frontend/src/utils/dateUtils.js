/**
 * Simple date utilities for calendar layout and interactions
 */

// PUBLIC_INTERFACE
export function startOfWeek(date) {
  /** Returns a new Date set to Monday of the week of `date` */
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}

// PUBLIC_INTERFACE
export function addDays(date, n) {
  /** Returns a new Date plus n days */
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// PUBLIC_INTERFACE
export function toISO(date) {
  /** ISO string without milliseconds */
  return new Date(date).toISOString();
}

// PUBLIC_INTERFACE
export function setTime(date, hh, mm) {
  /** Returns a copy of date at given hour/minute (local) */
  const d = new Date(date);
  d.setHours(hh, mm, 0, 0);
  return d;
}

// PUBLIC_INTERFACE
export function minutesBetween(a, b) {
  /** Returns minutes difference between two dates */
  return Math.round((+b - +a) / 60000);
}

// PUBLIC_INTERFACE
export function clamp(val, min, max) {
  /** Clamp a number between min and max */
  return Math.max(min, Math.min(max, val));
}
