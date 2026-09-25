'use client';

import { useState } from 'react';
import type { Dict } from '@/lib/i18n';
import { eulogySections } from '@/lib/eulogy';

// YouTube video IDs
const YOUTUBE_DAD_TRIBUTE_1 = { id: '36hRInmORJk', title: "Dad's Tribute" };
const YOUTUBE_DAD_TRIBUTE_2 = { id: 'gqUEH1do5jE', title: "Dad's Tribute #2" };
const YOUTUBE_SLIDESHOW = { id: 'Gz3_GaaAT68', title: 'Memorial Slideshow' };
const YOUTUBE_BENS_EULOGY = { id: 'LYYPcmTlfSc', title: "Ben's Eulogy" };
const YOUTUBE_MOMS_EULOGY = { id: '8hoPHCAxlm0', title: "Mom's Eulogy" };

// Piano tribute videos
const PIANO_VIDEOS = [
  { id: 'uUQAnunPIYw', title: 'Raise Me Up' },
  { id: 'NLnHu9GpBF8', title: 'Monsters' },
  { id: 'm1Rg8DNLEdg', title: 'What a Wonderful World' },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <>
      <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-2">
        {title}
      </h2>
      <div className="flex justify-center mb-8">
        <span className="w-2 h-2 rotate-45 bg-amber-500" />
      </div>
    </>
  );
}

function ArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex-shrink-0 w-11 h-11 rounded-full bg-white border border-blue-200 shadow-md hover:bg-blue-50 hover:shadow-lg text-blue-950 flex items-center justify-center transition-all"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
        {direction === 'left' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export default function VideoTributeClient({ dict }: { dict: Dict }) {
  const t = dict.tribute;
  const [tributeIndex, setTributeIndex] = useState(0);
  const [showEulogy, setShowEulogy] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  // Tribute section: All YouTube now
  const tributeVideos = [
    YOUTUBE_DAD_TRIBUTE_1,
    YOUTUBE_DAD_TRIBUTE_2,
    YOUTUBE_SLIDESHOW,
  ];

  const currentTribute = tributeVideos[tributeIndex];

  return (
    <>
      {/* Section 1: Tribute */}
      <section id="tribute" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfe]">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title={t.title} />

          <div className="flex items-center gap-3 sm:gap-4">
            <ArrowButton
              direction="left"
              onClick={() => setTributeIndex(tributeIndex === 0 ? tributeVideos.length - 1 : tributeIndex - 1)}
              label="Previous video"
            />

            <div className="flex-1 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-black w-full aspect-video">
                <iframe
                  key={`tribute-yt-${tributeIndex}`}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${currentTribute.id}`}
                  title={currentTribute.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <ArrowButton
              direction="right"
              onClick={() => setTributeIndex((tributeIndex + 1) % tributeVideos.length)}
              label="Next video"
            />
          </div>

          <div className="flex flex-col items-center mt-4 gap-1">
            <h3 className="text-lg font-serif text-blue-950 text-center">{currentTribute.title}</h3>
            <span className="text-xs text-slate-400">
              {tributeIndex + 1} of {tributeVideos.length}
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Music Dedication */}
      <section id="music" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Music Dedication" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {PIANO_VIDEOS.map((vid) => (
              <div key={vid.id} className="flex flex-col items-center">
                <div className="relative rounded-xl overflow-hidden shadow-lg border border-blue-100 bg-black aspect-[9/16] w-full max-w-[280px]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${vid.id}`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <span className="mt-3 text-sm text-slate-600 text-center font-medium">{vid.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Eulogy - Side by side */}
      <section id="eulogy" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfe]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="Eulogies" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Ben's Eulogy - YouTube */}
            <div className="flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-blue-100 bg-black aspect-[9/16] w-full max-w-[320px]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_BENS_EULOGY.id}`}
                  title={YOUTUBE_BENS_EULOGY.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <span className="mt-3 text-sm text-slate-600 text-center font-medium">{YOUTUBE_BENS_EULOGY.title}</span>
              <button
                type="button"
                onClick={() => setShowEulogy(true)}
                className="mt-2 px-4 py-2 text-sm font-medium text-blue-950 bg-white border border-blue-200 rounded-full shadow-sm hover:bg-blue-50 hover:shadow-md transition-all"
              >
                Read Eulogy
              </button>
            </div>

            {/* Mom's Eulogy - YouTube */}
            <div className="flex flex-col items-center">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-blue-100 bg-black aspect-[9/16] w-full max-w-[320px]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_MOMS_EULOGY.id}`}
                  title={YOUTUBE_MOMS_EULOGY.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <span className="mt-3 text-sm text-slate-600 text-center font-medium">{YOUTUBE_MOMS_EULOGY.title}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Eulogy Modal */}
      {showEulogy && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowEulogy(false)}
        >
          <button
            onClick={() => setShowEulogy(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 sm:p-8">
              <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-6">
                Ben&apos;s Eulogy
              </h2>
              <div className="space-y-3">
                {eulogySections.map((section, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setOpenSection(openSection === idx ? null : idx)}
                      className="w-full font-serif text-xl font-bold text-blue-950 p-5 cursor-pointer flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-center relative"
                    >
                      <span>{section.title}</span>
                      <svg
                        className={`w-5 h-5 text-slate-400 transition-transform absolute right-5 ${openSection === idx ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSection === idx && (
                      <div className="px-5 pb-5 space-y-3 text-slate-700 leading-relaxed border-t border-slate-200 pt-4">
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
