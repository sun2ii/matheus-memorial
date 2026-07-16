import type { Dict } from '@/lib/i18n';

export default function ServiceAgenda({ dict }: { dict: Dict }) {
  const t = dict.agenda;

  return (
    <section id="agenda" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfe]">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-2">
          {t.title}
        </h2>
        <div className="flex justify-center mb-6">
          <span className="w-2 h-2 rotate-45 bg-amber-500" />
        </div>
        <p className="text-center text-slate-700 leading-relaxed mb-8">{t.intro}</p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[6.5rem] sm:left-32 top-2 bottom-2 w-px bg-amber-300" aria-hidden="true" />

          <ol className="space-y-6">
            {t.items.map((item) => (
              <li key={`${item.time}-${item.label}`} className="relative flex items-start gap-4 sm:gap-6">
                <span className="w-24 sm:w-28 flex-shrink-0 text-right font-serif font-semibold text-blue-950 text-sm sm:text-base">
                  {item.time}
                </span>
                <span className="relative z-10 mt-1.5 flex-shrink-0 w-3 h-3 rounded-full bg-blue-950 border-2 border-amber-400" aria-hidden="true" />
                <span className="flex-1 text-slate-700 leading-relaxed">{item.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">{t.tzNote}</p>
      </div>
    </section>
  );
}
