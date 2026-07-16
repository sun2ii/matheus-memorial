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
          </div>
        </div>

        {/* Service details card — its own centered block below */}
        <div className="max-w-2xl mx-auto mt-10 sm:mt-12">
          <div className="relative rounded-xl overflow-hidden shadow-xl border border-amber-200 bg-gradient-to-b from-[#fdfbf5] to-amber-50">
            <div className="relative z-10 px-5 py-6 sm:px-8 text-center text-blue-950">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-blue-950 mb-1">
                {dict.service.detailsTitle}
              </h2>
              <p className="font-serif text-base sm:text-lg text-blue-900 mb-5">
                {dict.service.eventDate}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-left font-serif">
                {/* In person */}
                <div className="rounded-lg border border-amber-200 bg-white/70 p-4">
                  <div className="flex items-center gap-2 mb-2 text-amber-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
                      <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    <h3 className="font-bold text-blue-950">{dict.service.inPersonTitle}</h3>
                  </div>
                  <p className="font-bold text-blue-950">{dict.service.locationName}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{dict.service.locationAddress}</p>
                  <a
                    href="https://www.google.com/maps/place/Mount+Vernon+Memorial+Park+%26+Mortuary/@38.6795943,-121.2585006,17z/data=!4m6!3m5!1s0x809ae09c7a3457ff:0xda89dbee85b13492!8m2!3d38.6804409!4d-121.2579606!16s%2Fg%2F1v_w2m35?entry=ttu&g_ep=EgoyMDI2MDcwNy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-500 transition-colors mt-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                      <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {dict.service.mapLinkLabel}
                  </a>
                  <p className="text-sm font-semibold text-blue-950 mt-2">{dict.service.inPersonTime}</p>
                </div>

                {/* Online / livestream */}
                <div className="rounded-lg border border-blue-200 bg-white/70 p-4">
                  <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 flex-shrink-0">
                      <rect x="2" y="6" width="13" height="12" rx="2" />
                      <path d="M22 8l-5 4 5 4V8z" />
                    </svg>
                    <h3 className="font-bold text-blue-950">{dict.service.onlineTitle}</h3>
                  </div>
                  <p className="text-sm text-slate-700">{dict.service.onlineDesc}</p>
                  <p className="text-sm font-semibold text-blue-950 mt-2">{dict.service.usaTzNote}</p>
                  <p className="text-sm font-semibold text-blue-950">{dict.service.onlineTzNote}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/zoom-icon.webp" alt="Zoom" className="h-5 w-auto" />
                    <a
                      href="https://us06web.zoom.us/j/83792442464?pwd=QaDZju7z990AcJaseeRDbzEITGNNQo.1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-500 transition-colors"
                    >
                      {dict.service.zoomLinkLabel}
                    </a>
                  </div>
                  <p className="text-sm font-medium mt-1">{dict.service.meetingId}</p>
                  <p className="text-sm font-medium">{dict.service.passcode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
