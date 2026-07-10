'use client';

import { useEffect, useState, useTransition } from 'react';
import { submitAttendance } from '@/app/actions';
import type { Dict, Locale } from '@/lib/i18n';

type WelcomeDict = Dict['welcome'];

export default function RsvpForm({ locale, t }: { locale: Locale; t: WelcomeDict }) {
  const [notice, setNotice] = useState<'thanks' | 'duplicate' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Notices clear after 5 seconds so the form is ready for another entry
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    formData.set('language', locale);

    startTransition(async () => {
      try {
        const result = await submitAttendance(formData);
        setNotice(result.duplicate ? 'duplicate' : 'thanks');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    });
  }

  return (
    <div>
      <p className="text-sm font-medium text-blue-950 text-center mb-1">{t.attendingQuestion}</p>
      <p className="text-xs text-slate-500 text-center mb-3">{t.attendingHint}</p>

      {notice === 'thanks' && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
          <p className="text-sm font-medium">{t.attendThanks}</p>
        </div>
      )}

      {notice === 'duplicate' && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg text-center">
          <p className="text-sm font-medium">{t.alreadyRsvped}</p>
        </div>
      )}

      {!notice && (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            name="email"
            required
            disabled={isPending}
            placeholder={t.emailPlaceholder}
            className="flex-1 min-w-0 px-4 py-2.5 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 text-sm"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center whitespace-nowrap bg-blue-950 hover:bg-blue-900 disabled:bg-slate-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition-colors"
          >
            {isPending ? '...' : t.attendButton}
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-700 text-center mt-2">{error}</p>}
    </div>
  );
}
