import Image from 'next/image';
import RsvpForm from '@/components/RsvpForm';
import OpenModalButton from '@/components/OpenModalButton';
import type { Dict, Locale } from '@/lib/i18n';

export default function Hero({ locale, dict }: { locale: Locale; dict: Dict }) {
  const t = dict.hero;

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Ocean / sky background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/sea-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-blue-100/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Portrait */}
          <div className="flex justify-center md:justify-end">
            <div className="relative translate-y-[25px] w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-[10px] border-amber-400 shadow-2xl bg-white">
              <div className="absolute inset-x-0 top-[-15px] h-[115%]">
                <Image
                  src="/images/portrait.png"
                  alt="Matheus Basuni"
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="font-serif italic text-2xl sm:text-3xl text-blue-800 mb-2">
              {t.celebrating}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-blue-950 mb-5">
              Matheus Basuni
            </h1>

            {/* Divider with heart */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-16 bg-amber-500/70" />
              <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-4 h-4">
                <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
              </svg>
              <span className="h-px w-16 bg-amber-500/70" />
            </div>

            <p className="font-serif italic text-xl sm:text-2xl text-blue-900 mb-6">
              {t.dates}
            </p>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-md mx-auto mb-8">
              {t.intro}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <OpenModalButton className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-blue-50 font-medium px-6 py-3 rounded-lg shadow-lg transition-colors">
                {t.viewService}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </OpenModalButton>
              <a
                href="#guestbook"
                className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-blue-950 font-medium px-6 py-3 rounded-lg border border-blue-200 shadow transition-colors"
              >
                {t.shareAMemory}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
                </svg>
              </a>
            </div>

            {/* RSVP */}
            <div className="mt-8 max-w-md mx-auto bg-white/85 backdrop-blur-sm border border-amber-200 rounded-xl p-5 shadow-lg">
              <RsvpForm locale={locale} t={dict.welcome} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
