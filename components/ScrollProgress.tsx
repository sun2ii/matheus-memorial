'use client';

import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let ticking = false;

    const updateProgress = () => {
      ticking = false;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      // Write directly to the DOM — no React re-render per scroll event.
      // scaleX is GPU-composited (no layout/paint), unlike width.
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const requestTick = () => {
      // Batch scroll events: at most one update per animation frame (60fps)
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-blue-100">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-blue-600 to-amber-500 will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
