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
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-blue-100">
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
            <div className="flex items-start justify-center gap-4 sm:gap-6">
              {['Janti', 'Billy', 'Ben', 'Bella'].map((name) => (
                <div key={name} className="flex flex-col items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-8 h-8">
                    <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
                  </svg>
                  <span className="text-sm font-serif text-blue-950">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donations */}
        <div id="donations" className="border-t border-blue-100 p-8 sm:p-10 text-center scroll-mt-20">
          <h3 className="font-serif text-2xl text-blue-950 mb-1">{t.donationsTitle}</h3>
          <GoldDivider />
          <p className="text-slate-700 leading-relaxed max-w-lg mx-auto text-balance">
            {t.donationsIntro} {t.donationsVia}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-5">
            <div className="w-full sm:w-60 rounded-xl border border-slate-200 bg-white shadow-sm px-6 py-5 flex flex-col items-center justify-center gap-1">
              <span className="font-bold text-xl text-[#6d1ed4]">Zelle</span>
              <span className="text-sm text-slate-400 whitespace-nowrap">{t.donationsComingSoon}</span>
            </div>
            <a
              href="https://venmo.com/u/Janti-Gouw"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-60 rounded-xl border border-[#008cff]/40 bg-white shadow-sm px-6 py-5 flex flex-col items-center justify-center gap-1 hover:border-[#008cff] hover:shadow-md transition-all"
            >
              <span className="font-bold text-xl text-[#008cff]">Venmo</span>
              <span className="text-sm font-medium text-[#008cff]">@Janti-Gouw</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
