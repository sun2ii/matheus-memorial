'use client';

import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const duckedForVideoRef = useRef(false);

  useEffect(() => {
    // Listen for start music event from welcome modal
    const handleStartMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    };

    // Duck the music only if it was actually playing when the video started —
    // if the visitor had already muted it, leave that choice alone.
    const handleVideoPlaying = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        duckedForVideoRef.current = true;
        audio.pause();
      }
    };

    // Only resume music that we ourselves paused for the video — never
    // override a manual mute the visitor made independently.
    const handleVideoPaused = () => {
      const audio = audioRef.current;
      if (audio && duckedForVideoRef.current) {
        duckedForVideoRef.current = false;
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    window.addEventListener('startMusic', handleStartMusic);
    window.addEventListener('tributeVideoPlaying', handleVideoPlaying);
    window.addEventListener('tributeVideoPaused', handleVideoPaused);
    return () => {
      window.removeEventListener('startMusic', handleStartMusic);
      window.removeEventListener('tributeVideoPlaying', handleVideoPlaying);
      window.removeEventListener('tributeVideoPaused', handleVideoPaused);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/assets/unforgettable.mp3"
        autoPlay
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-950 hover:bg-blue-900 text-white shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label={isPlaying ? 'Mute music' : 'Play music'}
        title={isPlaying ? 'Mute music' : 'Play music'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M20.807,4.29a1,1,0,0,0-1.415,1.415,8.913,8.913,0,0,1,0,12.59,1,1,0,0,0,1.415,1.415A10.916,10.916,0,0,0,20.807,4.29Z"/>
            <path d="M18.1,7.291A1,1,0,0,0,16.68,8.706a4.662,4.662,0,0,1,0,6.588A1,1,0,0,0,18.1,16.709,6.666,6.666,0,0,0,18.1,7.291Z"/>
            <path d="M13.82.2A12.054,12.054,0,0,0,6.266,5H5a5.008,5.008,0,0,0-5,5v4a5.008,5.008,0,0,0,5,5H6.266A12.059,12.059,0,0,0,13.82,23.8a.917.917,0,0,0,.181.017,1,1,0,0,0,1-1V1.186A1,1,0,0,0,13.82.2ZM13,21.535a10.083,10.083,0,0,1-5.371-4.08A1,1,0,0,0,6.792,17H5a3,3,0,0,1-3-3V10A3,3,0,0,1,5,7h1.8a1,1,0,0,0,.837-.453A10.079,10.079,0,0,1,13,2.465Z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M13.82.2A12.054,12.054,0,0,0,6.266,5H5a5.008,5.008,0,0,0-5,5v4a5.008,5.008,0,0,0,5,5H6.266A12.059,12.059,0,0,0,13.82,23.8a.917.917,0,0,0,.181.017,1,1,0,0,0,1-1V1.186A1,1,0,0,0,13.82.2ZM13,21.535a10.083,10.083,0,0,1-5.371-4.08A1,1,0,0,0,6.792,17H5a3,3,0,0,1-3-3V10A3,3,0,0,1,5,7h1.8a1,1,0,0,0,.837-.453A10.079,10.079,0,0,1,13,2.465Z"/>
            <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );
}
