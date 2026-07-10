import Image from 'next/image';
import type { Dict } from '@/lib/i18n';

function TimelineIcon({ name }: { name: string }) {
  const common = 'w-5 h-5 text-white';
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
        <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
      </svg>
    );
  }
  if (name === 'cross') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={common}>
        <path d="M10 2h4v7h7v4h-7v9h-4v-9H3V9h7V2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={common}>
      <path d="M11 20c-5-1-8-5-8-10V5s4-1 8 2c4-3 8-2 8-2v5c0 5-3 9-8 10zM11 20v-8" />
    </svg>
  );
}

export default function LifeStory({ dict }: { dict: Dict }) {
  const t = dict.story;

  const timeline = [
    { icon: 'heart', title: t.t2018Title, body: t.t2018Body, strong: t.t2018Strong },
    { icon: 'cross', title: t.t2024Title, body: t.t2024Body, strong: t.t2024Strong },
    { icon: 'leaf', title: t.t2026Title, body: t.t2026Body, strong: t.t2026Strong },
  ];

  return (
    <section id="story" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Timeline */}
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-2">
            {t.timelineTitle}
          </h2>
          <div className="flex justify-center mb-6">
            <span className="w-2 h-2 rotate-45 bg-amber-500" />
          </div>
          <p className="text-center text-slate-700 leading-relaxed mb-10">
            {t.timelineIntro}
          </p>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-4 bottom-16 w-px bg-amber-300" aria-hidden="true" />

            <div className="space-y-8">
              {timeline.map((item) => (
                <div key={item.title} className="relative flex gap-5">
                  <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-blue-950 border-2 border-amber-400 flex items-center justify-center shadow">
                    <TimelineIcon name={item.icon} />
                  </div>
                  <div className="flex-1 bg-[#fbfcfe] border border-blue-100 rounded-xl p-6 shadow-sm">
                    <h3 className="font-serif text-lg text-blue-950 font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
                      {item.body}
                    </p>
                    {item.strong && (
                      <p className="text-sm sm:text-[15px] leading-relaxed mt-3">
                        <strong className="text-blue-950">{item.strong}</strong>
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* The Greatest Gift */}
              <div className="relative flex gap-5">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center shadow">
                  <Image
                    src="/images/thumbs-up-icon.png"
                    alt=""
                    width={24}
                    height={24}
                    className="w-6 h-6"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-blue-950 font-semibold mb-2">
                    {t.giftTitle}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {t.giftBody}
                  </p>
                  <p className="text-sm sm:text-[15px] leading-relaxed mt-3">
                    <strong className="text-blue-950">{t.giftStrong}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
