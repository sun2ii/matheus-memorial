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

            {/* Service details card */}
            <div className="relative max-w-xl mx-auto rounded-xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-b from-[#fdfbf5] to-amber-50">
              <div className="relative z-10 px-5 py-6 sm:px-8 text-center text-blue-950">
                <a
                  href="https://www.google.com/maps/place/Mount+Vernon+Memorial+Park+%26+Mortuary/@38.6795943,-121.2585006,17z/data=!4m6!3m5!1s0x809ae09c7a3457ff:0xda89dbee85b13492!8m2!3d38.6804409!4d-121.2579606!16s%2Fg%2F1v_w2m35?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-lg sm:text-xl font-bold text-blue-800 underline underline-offset-2 hover:text-blue-600 transition-colors"
                >
                  {dict.service.locationName}
                </a>
                <p className="font-serif font-semibold mt-1">{dict.service.locationAddress}</p>

                <div className="mt-5 flex items-center justify-center gap-6 sm:gap-10 font-serif">
                  <div className="flex-1 space-y-0.5">
                    <p>{dict.service.caLabel}</p>
                    <p>{dict.service.caDate}</p>
                    <p>{dict.service.caTime}</p>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p>{dict.service.jakartaLabel}</p>
                    <p>{dict.service.jakartaDate}</p>
                    <p>{dict.service.jakartaTime}</p>
                  </div>
                </div>

                <div className="mt-5 text-sm">
                  <a
                    href="https://us06web.zoom.us/j/83792442464?pwd=QaDZju7z990AcJaseeRDbzEITGNNQo.1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-500 transition-colors"
                  >
                    {dict.service.zoomLinkLabel}
                  </a>
                  <p className="font-medium">{dict.service.meetingId}</p>
                  <p className="font-medium">{dict.service.passcode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
