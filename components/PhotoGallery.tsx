import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import type { Dict } from '@/lib/i18n';

function getGalleryPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), 'public', 'images', 'gallery');
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/gallery/${f}`);
  } catch {
    return [];
  }
}

function PlaceholderTile({ index, label }: { index: number; label: string }) {
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 border border-blue-100 shadow-sm flex items-center justify-center">
      <div className="text-center px-4">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-10 h-10 mx-auto text-blue-300 mb-2"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M3 17l5-4 3 2.5L16 11l5 4" />
        </svg>
        <p className="text-xs text-blue-400">{label}</p>
        <span className="sr-only">Gallery placeholder {index + 1}</span>
      </div>
    </div>
  );
}

export default function PhotoGallery({ dict }: { dict: Dict }) {
  const t = dict.gallery;
  const photos = getGalleryPhotos();

  return (
    <section id="gallery" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#eff6ff]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-blue-950 text-center mb-2">
          {t.title}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="h-px w-10 bg-amber-400" />
          <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
          <span className="h-px w-10 bg-amber-400" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {photos.length > 0
            ? photos.slice(0, 12).map((src) => (
                <div
                  key={src}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Image
                    src={src}
                    alt={t.photoAlt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <PlaceholderTile key={i} index={i} label={t.comingSoon} />
              ))}
        </div>

        {photos.length === 0 && (
          <p className="text-center text-sm text-blue-400 mt-8 italic">{t.comingSoonNote}</p>
        )}
      </div>
    </section>
  );
}
