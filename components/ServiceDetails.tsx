import type { Dict } from '@/lib/i18n';

function GoldDivider() {
  return (
    <div className="flex justify-center mb-6">
      <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
    </div>
  );
}

export default function ServiceDetails({ dict }: { dict: Dict }) {
  const t = dict.service;

  return (
    <section id="service" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto bg-[#fdfdfb] border border-blue-100 rounded-2xl shadow-sm">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
          {/* Service Details */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">{t.detailsTitle}</h3>
            <GoldDivider />
            <ul className="space-y-3 text-[15px] text-center text-slate-700">
              <li className="flex items-center justify-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-[18px] h-[18px] flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="whitespace-nowrap">
                  {t.date} · {t.time.trim()}
                </span>
              </li>
              <li className="flex items-start justify-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-[18px] h-[18px] mt-0.5 flex-shrink-0">
                  <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>
                  {t.locationName}
                  <br />
                  {t.locationAddress}
                </span>
              </li>
            </ul>
          </div>

          {/* Message of Comfort */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">{t.comfortTitle}</h3>
            <GoldDivider />
            <p className="font-serif italic text-lg text-blue-900 leading-relaxed mb-4">
              {t.comfortQuote}
            </p>
            <p className="text-sm text-slate-500">{t.comfortRef}</p>
          </div>

          {/* Note from the Family */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">{t.familyTitle}</h3>
            <GoldDivider />
            <p className="text-slate-700 leading-relaxed mb-6">{t.familyNote}</p>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-8 h-8 mx-auto">
              <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
