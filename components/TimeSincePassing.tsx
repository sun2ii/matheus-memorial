'use client';

import { useEffect, useState } from 'react';

export default function TimeSincePassing() {
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // July 6th, 2026 at 11:40 AM PST
    const passingDate = new Date('2026-07-06T11:40:00-07:00');

    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - passingDate.getTime();

      if (diff <= 0) {
        setTimeElapsed({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-3">
      <p className="text-sm italic text-slate-600 text-center mb-2">
        Time since Matheus&apos; final journey home
      </p>
      <div className="flex items-center justify-center gap-2 text-blue-900">
        <div className="text-center">
          <div className="text-lg font-semibold">{timeElapsed.days}</div>
          <div className="text-[10px] text-slate-600">days</div>
        </div>
        <span className="text-sm">:</span>
        <div className="text-center">
          <div className="text-lg font-semibold">{String(timeElapsed.hours).padStart(2, '0')}</div>
          <div className="text-[10px] text-slate-600">hours</div>
        </div>
        <span className="text-sm">:</span>
        <div className="text-center">
          <div className="text-lg font-semibold">{String(timeElapsed.minutes).padStart(2, '0')}</div>
          <div className="text-[10px] text-slate-600">min</div>
        </div>
        <span className="text-sm">:</span>
        <div className="text-center">
          <div className="text-lg font-semibold">{String(timeElapsed.seconds).padStart(2, '0')}</div>
          <div className="text-[10px] text-slate-600">sec</div>
        </div>
      </div>
    </div>
  );
}
