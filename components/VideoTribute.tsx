'use client';

import { useEffect, useRef } from 'react';
import type { Dict } from '@/lib/i18n';

const YOUTUBE_VIDEO_ID = 'Gz3_GaaAT68';
const PLAYER_ELEMENT_ID = 'tribute-video-player';

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

export default function VideoTribute({ dict }: { dict: Dict }) {
  const t = dict.tribute;
  const playerRef = useRef<YTPlayerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(PLAYER_ELEMENT_ID, {
        events: {
          onStateChange: (event: { data: number }) => {
            if (!window.YT) return;
            // Duck the background music while the tribute video is actually
            // playing, and let it resume once the video is paused or ends.
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

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-black">
          <iframe
            id={PLAYER_ELEMENT_ID}
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1`}
            title={t.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
