import type { Dict } from '@/lib/i18n';
import JourneyTimeline from '@/components/JourneyTimeline';

export default function LifeStory({ dict }: { dict: Dict }) {
  const t = dict.story;
  const o = dict.obituary;

  const timeline = [
    { icon: 'heart', title: t.t2018Title, body: t.t2018Body, strong: t.t2018Strong },
    { icon: 'cross', title: t.t2024Title, body: t.t2024Body, strong: t.t2024Strong },
    { icon: 'leaf', title: t.t2026Title, body: t.t2026Body, strong: t.t2026Strong },
  ];

  const gift = { title: t.giftTitle, body: t.giftBody, strong: t.giftStrong };

  return (
    <section id="story" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Obituary */}
        <div className="mb-16 sm:mb-20">
          <p className="text-center text-sm italic tracking-wide text-amber-700 mb-3">
            {o.eyebrow}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-blue-950 text-center leading-tight">
            {o.name}
          </h2>
          <p className="text-center text-slate-600 mt-2 mb-5">{o.dates}</p>
          <div className="flex justify-center mb-10">
            <span className="w-2 h-2 rotate-45 bg-amber-500" />
          </div>

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>{o.p1}</p>
            <p>{o.p2Lead}</p>

            {/* Favorite words */}
            <blockquote className="my-8 border-l-2 border-amber-400 pl-5">
              <p className="font-serif text-xl sm:text-2xl text-blue-950 italic">
                &ldquo;{o.quote}&rdquo;
              </p>
            </blockquote>

            <p>{o.p3}</p>
            <p>{o.p4}</p>
          </div>

          {/* Survived by */}
          <div className="mt-8 bg-[#fbfcfe] border border-blue-100 rounded-xl p-6 text-center">
            <p className="text-slate-700 leading-relaxed">{o.survivedBy}</p>
          </div>

          {/* Closing line */}
          <p className="mt-8 text-center font-serif text-lg text-blue-950 italic leading-relaxed">
            {o.closing}
          </p>
        </div>

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

          <JourneyTimeline
            timeline={timeline}
            gift={gift}
            readMoreLabel={t.readMore}
            showLessLabel={t.showLess}
          />
        </div>
      </div>
    </section>
  );
}
