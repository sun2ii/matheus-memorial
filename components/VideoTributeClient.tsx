'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dict } from '@/lib/i18n';
import type { Video } from './VideoTribute';
import { eulogySections } from '@/lib/eulogy';

const YOUTUBE_VIDEO_ID = 'Gz3_GaaAT68';

type YTPlayerState = { PLAYING: number; PAUSED: number; ENDED: number };
type YTPlayerInstance = { destroy?: () => void };
type YTNamespace = {
  Player: new (elementId: string, options: Record<string, unknown>) => YTPlayerInstance;
  PlayerState: YTPlayerState;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
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

type AllVideo = { type: 'youtube'; id: string; title: string } | { type: 'drive'; video: Video };

export default function VideoTributeClient({ dict, videos }: { dict: Dict; videos: Video[] }) {
  const t = dict.tribute;
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showEulogy, setShowEulogy] = useState(false);
  const [openSection, setOpenSection] = useState<number | null>(null);

  // Combine YouTube + Drive videos into one list
  // Order: Dad's Tribute (1), Dad's Tribute #2 (2), Memorial Slideshow (3), then rest (4+)
  const driveVideosWithOrder = videos as (Video & { order: number })[];
  const beforeYoutube = driveVideosWithOrder.filter((v) => v.order < 3);
  const afterYoutube = driveVideosWithOrder.filter((v) => v.order >= 3);

  const allVideos: AllVideo[] = [
    ...beforeYoutube.map((v) => ({ type: 'drive' as const, video: v })),
    { type: 'youtube', id: YOUTUBE_VIDEO_ID, title: 'Memorial Slideshow' },
    ...afterYoutube.map((v) => ({ type: 'drive' as const, video: v })),
  ];

  // YouTube player setup
  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(`youtube-player-${currentIndex}`, {
        events: {
          onStateChange: (event: { data: number }) => {
            if (!window.YT) return;
            if (event.data === window.YT.PlayerState.PLAYING) {
              window.dispatchEvent(new Event('tributeVideoPlaying'));
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              window.dispatchEvent(new Event('tributeVideoPaused'));
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, [currentIndex]);

  function goNext() {
    setCurrentIndex((currentIndex + 1) % allVideos.length);
  }

  function goPrev() {
    setCurrentIndex(currentIndex === 0 ? allVideos.length - 1 : currentIndex - 1);
  }

  // Keyboard navigation for lightbox and eulogy modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showEulogy) setShowEulogy(false);
        else if (lightboxIndex !== null) setLightboxIndex(null);
      }
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') {
        setLightboxIndex(lightboxIndex === 0 ? videos.length - 1 : lightboxIndex - 1);
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((lightboxIndex + 1) % videos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, videos.length, showEulogy]);

  const current = allVideos[currentIndex];
  const currentTitle = current.type === 'youtube' ? current.title : current.video.title;
  const isVertical = current.type === 'drive' && current.video.isVertical;
  const isBensEulogy = currentTitle === "Ben's Eulogy";

  // Preload all Drive videos on mount
  useEffect(() => {
    allVideos.forEach((v) => {
      if (v.type === 'drive') {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = v.video.src;
        video.load();
      }
    });
  }, []);

  return (
    <section id="tribute" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#fbfcfe]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl text-blue-950 text-center mb-2">
          {t.title}
        </h2>
        <div className="flex justify-center mb-8">
          <span className="w-2 h-2 rotate-45 bg-amber-500" />
        </div>

        {/* Video Carousel */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ArrowButton direction="left" onClick={goPrev} label="Previous video" />

          <div className="flex-1 flex justify-center">
            <div className={`relative rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-black ${
              isVertical
                ? 'h-[70vh] aspect-[9/16]'
                : 'w-full aspect-video'
            }`}>
              {current.type === 'youtube' ? (
                <iframe
                  key={`youtube-${currentIndex}`}
                  id={`youtube-player-${currentIndex}`}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${current.id}?enablejsapi=1`}
                  title={current.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  key={current.video.id}
                  className="absolute inset-0 w-full h-full object-contain"
                  src={current.video.src}
                  poster={current.video.poster}
                  controls
                  preload="metadata"
                />
              )}
            </div>
          </div>

          <ArrowButton direction="right" onClick={goNext} label="Next video" />
        </div>

        {/* Video title and position */}
        <div className="flex flex-col items-center mt-4 gap-1">
          <h3 className="text-lg font-serif text-blue-950 text-center">{currentTitle}</h3>
          <span className="text-xs text-slate-400">
            {currentIndex + 1} of {allVideos.length}
          </span>
          {isBensEulogy && (
            <button
              type="button"
              onClick={() => setShowEulogy(true)}
              className="mt-3 px-4 py-2 text-sm font-medium text-blue-950 bg-white border border-blue-200 rounded-full shadow-sm hover:bg-blue-50 hover:shadow-md transition-all"
            >
              Read Eulogy
            </button>
          )}
        </div>
      </div>

      {/* Drive Video Lightbox Modal (for when clicking from thumbnails if we add them later) */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video"
          >
            <video
              key={videos[lightboxIndex].id}
              className="w-full h-full rounded-lg"
              src={videos[lightboxIndex].src}
              controls
              autoPlay
            />
          </div>
        </div>
      )}

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
    </section>
  );
}
