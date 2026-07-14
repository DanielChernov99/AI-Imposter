const POSTGRES_TIMESTAMP_PATTERN =
  /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}:\d{2})(?:\.(\d+))?(Z|[+-]\d{2}(?::?\d{2})?)?$/i;

function normalizeTimezone(timezone) {
  if (!timezone || timezone.toUpperCase() === "Z") {
    return "Z";
  }

  if (/^[+-]\d{2}$/.test(timezone)) {
    return `${timezone}:00`;
  }

  if (/^[+-]\d{4}$/.test(timezone)) {
    return `${timezone.slice(0, 3)}:${timezone.slice(3)}`;
  }

  return timezone;
}

/**
 * Parses Supabase/Postgres timestamps without relying on browser-specific
 * support for a space separator, microsecond precision or short offsets.
 * Timestamps without an offset are treated as UTC, matching Supabase's
 * default database timezone.
 */
export function parseTimestampMs(timestamp) {
  if (typeof timestamp === "number") {
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  if (typeof timestamp !== "string") {
    return null;
  }

  const match = POSTGRES_TIMESTAMP_PATTERN.exec(timestamp.trim());

  if (!match) {
    return null;
  }

  const [, date, time, fraction = "", timezone] = match;
  const milliseconds = fraction.slice(0, 3).padEnd(3, "0");
  const normalizedTimestamp = `${date}T${time}.${milliseconds}${normalizeTimezone(timezone)}`;
  const parsedTimestamp = Date.parse(normalizedTimestamp);

  return Number.isFinite(parsedTimestamp) ? parsedTimestamp : null;
}

export function secondsUntil(timestamp, now = Date.now()) {
  const parsedEndTime = parseTimestampMs(timestamp);

  if (parsedEndTime === null || !Number.isFinite(now)) {
    return null;
  }

  const remainingMilliseconds = parsedEndTime - now;
  const remainingSeconds = Math.ceil(remainingMilliseconds / 1000);

  return Math.max(0, remainingSeconds);
}
