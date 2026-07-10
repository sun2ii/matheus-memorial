import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Ocean / sky background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/sea-bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-blue-100/60" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Portrait */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-[10px] border-amber-400 shadow-2xl bg-white">
              <Image
                src="/images/portrait.jpg"
                alt="Matheus Basuni"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <p className="font-serif italic text-2xl sm:text-3xl text-blue-800 mb-2">
              Celebrating the Life of
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-blue-950 mb-5">
              Matheus Basuni
            </h1>

            {/* Divider with heart */}
            <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
              <span className="h-px w-16 bg-amber-500/70" />
              <svg viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="w-4 h-4">
                <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
              </svg>
              <span className="h-px w-16 bg-amber-500/70" />
            </div>

            <p className="font-serif italic text-xl sm:text-2xl text-blue-900 mb-6">
              February 25, 1960 &ndash; July 6, 2026
            </p>

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
              Matheus lived with courage, faith, humor, and deep love for family
              and friends. This space was created to honor his life, share his
              story, and hold the memories that continue to bloom because of him.
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <a
                href="#service"
                className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-blue-50 font-medium px-6 py-3 rounded-lg shadow-lg transition-colors"
              >
                View Service Details
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
              </a>
              <a
                href="#guestbook"
                className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-blue-950 font-medium px-6 py-3 rounded-lg border border-blue-200 shadow transition-colors"
              >
                Share a Memory
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
