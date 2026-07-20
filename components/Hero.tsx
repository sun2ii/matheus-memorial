import Image from 'next/image';
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Portrait + name, vertically aligned as a pair */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          {/* Portrait */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[26rem] lg:h-[26rem] rounded-full overflow-hidden border-[10px] border-amber-400 shadow-2xl bg-white">
              <div className="absolute inset-x-0 top-[-15px] h-[115%]">
                <Image
                  src="/images/portrait.png"
                  alt="Matheus Basuni"
                  fill
                  sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 416px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Name */}
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

            <p className="font-serif italic text-xl sm:text-2xl text-blue-900">
              {t.dates}
            </p>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              {t.legacyLine}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
