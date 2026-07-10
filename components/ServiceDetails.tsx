function GoldDivider() {
  return (
    <div className="flex justify-center mb-6">
      <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
    </div>
  );
}

export default function ServiceDetails() {
  return (
    <section id="service" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto bg-[#fdfdfb] border border-blue-100 rounded-2xl shadow-sm">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-100">
          {/* Service Details */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">Service Details</h3>
            <GoldDivider />
            <ul className="space-y-4 text-left max-w-xs mx-auto text-slate-700">
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>
                  Sunday, July 19<sup>th</sup>, 2026
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span>10:00am &ndash; 2:00pm</span>
              </li>
              <li className="flex items-start gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="2" className="w-5 h-5 mt-0.5 flex-shrink-0">
                  <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>
                  Mount Vernon Memorial Park at The Chapel
                  <br />
                  8201 Greenback Ln, Fair Oaks, CA 95628
                </span>
              </li>
            </ul>
          </div>

          {/* Message of Comfort */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">A Message of Comfort</h3>
            <GoldDivider />
            <p className="font-serif italic text-lg text-blue-900 leading-relaxed mb-4">
              &ldquo;The Lord is close to the brokenhearted and saves those who
              are crushed in spirit.&rdquo;
            </p>
            <p className="text-sm text-slate-500">&mdash; Psalm 34:18</p>
          </div>

          {/* Note from the Family */}
          <div className="p-8 sm:p-10 text-center">
            <h3 className="font-serif text-2xl text-blue-950 mb-1">A Note from the Family</h3>
            <GoldDivider />
            <p className="text-slate-700 leading-relaxed mb-6">
              Thank you for your prayers, presence, and love during this time.
              Your kindness means more than words can express.
            </p>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-8 h-8 mx-auto">
              <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
