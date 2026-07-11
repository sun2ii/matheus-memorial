import { sql } from '@/lib/db';
import type { Dict, Locale } from '@/lib/i18n';

interface GuestbookEntry {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  message: string;
  created_at: Date;
}

async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const result = await sql`
      SELECT id, visitor_name, visitor_email, message, created_at
      FROM guestbook_entries
      ORDER BY created_at DESC
    `;
    return result as GuestbookEntry[];
  } catch (error) {
    console.error('Failed to fetch guestbook entries:', error);
    return [];
  }
}

function formatDate(date: Date | string, locale: Locale): string {
  // Database returns UTC timestamp - convert to target timezone
  const timezone = locale === 'id' ? 'Asia/Jakarta' : 'America/Los_Angeles';

  // The created_at column is TIMESTAMP (no time zone) storing UTC wall-clock
  // time. The Neon driver parses it as a *local-time* Date, so we must
  // reinterpret its wall-clock components as UTC to get the true instant.
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

  // Format with timezone conversion
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

function HeartBadge() {
  return (
    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#fdfbf5] border border-amber-200 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-4 h-4">
        <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
      </svg>
    </span>
  );
}

export default async function GuestbookMessages({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dict;
}) {
  const entries = await getGuestbookEntries();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
      <h3 className="font-serif text-2xl text-blue-950 text-center mb-1">
        {dict.guestbook.listTitle}
      </h3>
      <div className="flex justify-center mb-6">
        <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
      </div>

      {entries.length === 0 ? (
        <p className="text-slate-500 text-center py-10 italic">{dict.guestbook.empty}</p>
      ) : (
        <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex gap-4 bg-[#fbfcfe] rounded-xl p-5 border border-blue-100 shadow-sm"
            >
              <HeartBadge />
              <div className="flex-1">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-2">
                  {entry.message}
                </p>
                <p className="text-right text-sm text-blue-950 font-medium">
                  - {entry.visitor_name}
                </p>
                <p className="text-right text-xs text-slate-400">
                  {formatDate(entry.created_at, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
