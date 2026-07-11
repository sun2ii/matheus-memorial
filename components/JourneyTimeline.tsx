'use client';

import { useState } from 'react';
import Image from 'next/image';

type TimelineItem = {
  icon: string;
  title: string;
  body: string;
  strong?: string;
};

type Gift = {
  title: string;
  body: string;
  strong: string;
};

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

export default function JourneyTimeline({
  timeline,
  gift,
  readMoreLabel,
  showLessLabel,
}: {
  timeline: TimelineItem[];
  gift: Gift;
  readMoreLabel: string;
  showLessLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center mb-10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="journey-details"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-300 bg-[#fdfbf5] text-blue-950 font-serif text-[15px] hover:bg-amber-50 hover:border-amber-400 transition-colors shadow-sm"
        >
          <span>{open ? showLessLabel : readMoreLabel}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Collapsible region: animates via grid-rows 0fr -> 1fr */}
      <div
        id="journey-details"
        className="grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="relative pt-1">
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
                    {gift.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-line">
                    {gift.body}
                  </p>
                  <p className="text-sm sm:text-[15px] leading-relaxed mt-3">
                    <strong className="text-blue-950">{gift.strong}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
