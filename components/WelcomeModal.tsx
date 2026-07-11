'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setLocaleCookie } from '@/components/LanguageSwitcher';
import { OPEN_WELCOME_EVENT } from '@/components/OpenModalButton';
import type { Dict, Locale } from '@/lib/i18n';

const SEEN_KEY = 'memorial-welcome-seen';

export default function WelcomeModal({
  locale,
  dicts,
}: {
  locale: Locale;
  dicts: Record<Locale, Dict>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Locale>(locale);

  const t = dicts[lang].welcome;
  const service = dicts[lang].service;

  useEffect(() => {
    if (!sessionStorage.getItem(SEEN_KEY)) setOpen(true);

    // Anything on the page can reopen the modal by firing this event
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_WELCOME_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WELCOME_EVENT, onOpen);
  }, []);

  function close() {
    sessionStorage.setItem(SEEN_KEY, '1');
    setOpen(false);

    // Start music playback after user interaction
    const event = new CustomEvent('startMusic');
    window.dispatchEvent(event);
  }

  function chooseLanguage(next: Locale) {
    setLang(next);
    setLocaleCookie(next);
    router.refresh();
  }

  if (!open) return null;

  const langBase = 'flex-1 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-sm" onClick={close} />

      <div className="relative w-full max-w-md bg-[#fdfbf5] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Portrait */}
        <div className="flex justify-center">
          <div className="relative w-56 h-56 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg bg-white">
            <Image
              src="/images/portrait.png"
              alt="Matheus Basuni"
              fill
              sizes="500px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-2xl text-blue-950">{t.title}</h2>
          <div className="flex justify-center mt-2 mb-3">
            <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {t.brief}
          </p>
        </div>

        {/* Language choice */}
        <div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => chooseLanguage('en')}
              className={`${langBase} ${
                lang === 'en'
                  ? 'bg-blue-950 text-blue-50 border-blue-950'
                  : 'bg-white text-blue-950 border-amber-200 hover:bg-amber-50'
              }`}
            >
              🇺🇸 English
            </button>
            <button
              type="button"
              onClick={() => chooseLanguage('id')}
              className={`${langBase} ${
                lang === 'id'
                  ? 'bg-blue-950 text-blue-50 border-blue-950'
                  : 'bg-white text-blue-950 border-amber-200 hover:bg-amber-50'
              }`}
            >
              🇮🇩 Bahasa Indonesia
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          className="w-full px-8 py-4 text-lg font-bold text-blue-900 hover:text-blue-950 underline underline-offset-4 transition-colors"
        >
          {t.continueButton}
        </button>
      </div>
    </div>
  );
}
