import type { Locale } from './i18n';

// Shared date formatter for DB timestamps. The created_at columns are
// TIMESTAMP (no time zone) storing UTC wall-clock time; the Neon driver parses
// them as a *local-time* Date, so we reinterpret the wall-clock components as
// UTC to recover the true instant, then format into the locale's timezone.
export function formatDate(date: Date | string, locale: Locale): string {
  const timezone = locale === 'id' ? 'Asia/Jakarta' : 'America/Los_Angeles';

  let timestamp: Date;
  if (typeof date === 'string') {
    // e.g. "2026-07-10 03:25:00.123" -> "2026-07-10T03:25:00.123Z"
    let iso = date.trim().replace(' ', 'T');
    if (/[+-]\d{2}$/.test(iso)) iso += ':00'; // Postgres "+00" -> "+00:00"
    const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(iso);
    timestamp = new Date(hasZone ? iso : iso + 'Z');
  } else {
    timestamp = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    );
  }

  const dateStr = timestamp.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });

  const timeStr = timestamp.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const tzLabel = locale === 'id' ? 'WIB 🇮🇩' : 'PST 🇺🇸';
  return `${dateStr} at ${timeStr} ${tzLabel}`;
}
