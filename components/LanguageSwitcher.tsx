'use client';

import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    router.refresh();
  }

  const base = 'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors';
  const active = 'bg-blue-950 text-blue-50';
  const inactive = 'text-blue-950/70 hover:text-blue-950 hover:bg-amber-100';

  return (
    <div
      className="flex items-center gap-1 border border-amber-200 rounded-lg p-0.5 bg-white/70"
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={`${base} ${locale === 'en' ? active : inactive}`}
        aria-pressed={locale === 'en'}
      >
        🇺🇸 EN
      </button>
      <button
        type="button"
        onClick={() => switchTo('id')}
        className={`${base} ${locale === 'id' ? active : inactive}`}
        aria-pressed={locale === 'id'}
      >
        🇮🇩 ID
      </button>
    </div>
  );
}
