const timeline = [
  {
    icon: 'heart',
    title: '2018 – A Second Chance at Life',
    body: (
      <>
        After developing heart complications in his mid-to-late 50s, Matheus
        suffered a silent heart attack and was hospitalized in June 2018 in
        critical condition. He underwent open-heart surgery, received an LVAD,
        and five months later received the gift of a 20-year-old donor heart.{' '}
        <strong className="text-blue-950">
          On July 22, 2018, he successfully received his heart transplant at UCSF.
        </strong>
      </>
    ),
  },
  {
    icon: 'cross',
    title: '2024 – Surviving the Impossible',
    body: (
      <>
        In June 2024, while visiting family and friends in Los Angeles, he
        suffered acute heart transplant rejection. In the ICU, his heart stopped
        for 26 minutes, yet he survived. Still unconscious, he was airlifted
        back to UCSF, underwent weeks of intensive treatment, and recovered
        enough to return home.
      </>
    ),
  },
  {
    icon: 'leaf',
    title: '2026 – His Final Fight',
    body: (
      <>
        Nearly eight years after his transplant, Matheus experienced severe
        kidney complications and was admitted to UC Davis Medical Center on
        June 11, 2026, then transferred to UCSF. After intensive treatment, he
        asked for one final wish: to return home, ride once more in his beloved
        white Jaguar XJ8, and spend his remaining days under the oak trees he
        loved, surrounded by family and close friends.{' '}
        <strong className="text-blue-950">On June 18, 2026, he made the journey home.</strong>
      </>
    ),
  },
];

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

export default function LifeStory() {
  return (
    <section id="story" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Left: A Life of Resilience */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-blue-950 leading-snug mb-3">
            A Life of Resilience,
            <br />
            Love, and Faith
          </h2>
          <div className="w-20 h-0.5 bg-amber-500 mb-8" />

          <div className="space-y-5 text-slate-700 leading-relaxed">
            <p>
              Matheus was a fighter, a believer, a dreamer, and a
              relationship-builder. He lived each day with gratitude and
              courage, inspiring everyone around him with his kindness, strong
              faith, and unwavering determination.
            </p>
            <p>
              He cherished his family deeply, valued his friendships, and found
              joy in the simple moments that made life meaningful. His legacy
              lives on in the love he gave so freely and the lives he touched so
              profoundly.
            </p>
          </div>

          {/* Quote card */}
          <div className="mt-10 bg-[#fdfbf5] border border-amber-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <span className="font-serif text-5xl text-amber-500 leading-none">&ldquo;</span>
            <p className="font-serif italic text-lg text-blue-950 -mt-3">
              He lived fully, loved deeply, and held onto hope through every
              impossible moment.&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-3">
          <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-2">
            Journey of Matheus&rsquo; Heart Transplant &amp; Fighting Spirit
          </h2>
          <div className="flex justify-center mb-10">
            <span className="w-2 h-2 rotate-45 bg-amber-500" />
          </div>

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
                    <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}

              {/* The Greatest Gift */}
              <div className="relative flex gap-5">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center shadow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" className="w-5 h-5">
                    <path d="M12 2l2.4 6.9H21l-5.4 4.2 2 6.9-5.6-4.2-5.6 4.2 2-6.9L3 8.9h6.6L12 2z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-blue-950 font-semibold mb-2">
                    The Greatest Gift
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                    Against all expectations, Matheus spent 18 more days at home
                    surrounded by the people, places, and memories he cherished
                    most. Those days were filled with love, laughter, visitors,
                    favorite foods, and moments that became lifelong memories.
                    In the end, perhaps his greatest miracle was being given the
                    chance to spend his final days exactly where he wanted to
                    be: at home, <strong className="text-blue-950">surrounded by love.</strong>
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
