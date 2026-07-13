'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/formatting';
import type { Locale } from '@/lib/i18n';
import type { PhotoMetadata } from '@/lib/drive';

type Photo = { src: string; fullSrc?: string; alt: string; metadata?: PhotoMetadata };

type Strings = {
  photoAlt: string;
  comingSoon: string;
  comingSoonNote: string;
  uploadButton: string;
  uploading: string;
  uploadSuccess: string;
  uploadError: string;
  uploaderPrompt: string;
  uploaderPlaceholder: string;
  uploaderContinue: string;
  uploaderError: string;
  uploadedBy: string;
};

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

export default function GalleryCarousel({
  photos,
  locale,
  t,
}: {
  photos: Photo[];
  locale: Locale;
  t: Strings;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [notice, setNotice] = useState<'success' | 'error' | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [view, setView] = useState<'carousel' | 'grid'>('carousel');
  const pausedRef = useRef(false);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      // Bail out if already tracked — returning the same reference skips the
      // re-render (the ref callback below runs on every render, so this
      // guard is what prevents an infinite update loop).
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  function scroll(direction: 'left' | 'right') {
    const strip = stripRef.current;
    if (!strip) return;
    const tile = strip.querySelector('div');
    const step = tile ? tile.clientWidth + 16 : 336;
    const newScroll = strip.scrollLeft + (direction === 'left' ? -step : step);

    // Loop: if at end, go to beginning; if at beginning (going left), go to end
    if (direction === 'right' && newScroll >= strip.scrollWidth - strip.clientWidth) {
      strip.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'left' && strip.scrollLeft === 0) {
      strip.scrollTo({ left: strip.scrollWidth, behavior: 'smooth' });
    } else {
      strip.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
    }
  }

  function nextPhoto() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  }

  function prevPhoto() {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? photos.length - 1 : lightboxIndex - 1);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex !== null) {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Auto-advance the carousel. Pauses while the lightbox is open, the grid
  // view is active, the user is hovering/touching the strip, or there aren't
  // enough photos to scroll.
  useEffect(() => {
    if (view !== 'carousel' || lightboxIndex !== null || photos.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) scroll('right');
    }, 3500);
    return () => clearInterval(id);
  }, [view, lightboxIndex, photos.length]);

  function handleUploadClick() {
    setNotice(null);
    setUploaderName('');
    setShowUploadForm(true);
  }

  function handleUploaderSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploaderName.trim().length < 2) return;
    inputRef.current?.click();
  }

  async function compressImage(file: File): Promise<File> {
    const LIMIT = 4 * 1024 * 1024; // stay under Vercel's 4.5MB body cap
    const MAX_DIMENSION = 2000;

    // Re-encoding a GIF on a canvas would lose its animation
    if (file.type === 'image/gif' && file.size <= LIMIT) return file;

    let bitmap: ImageBitmap;
    try {
      // 'from-image' bakes in EXIF rotation; older Safari may reject the
      // options object, so fall back to a plain call.
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() =>
        createImageBitmap(file)
      );
    } catch {
      // Browser can't decode this format (e.g. HEIC on Chrome/Firefox).
      // The original is fine to upload if it fits under the limit.
      if (file.size <= LIMIT) return file;
      throw new Error('unsupported-format');
    }

    try {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas-unavailable');

      // White background so PNG transparency doesn't turn black in JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(bitmap, 0, 0, width, height);

      const toJpeg = (quality: number) =>
        new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

      // 2000px @ q0.85 is almost always well under 1MB; one retry covers
      // pathological cases (heavy noise/grain).
      let blob = await toJpeg(0.85);
      if (blob && blob.size > LIMIT) blob = await toJpeg(0.7);
      if (!blob || blob.size > LIMIT) throw new Error('compression-failed');

      const name = file.name.replace(/\.\w+$/, '') + '.jpg';
      return new File([blob], name, { type: 'image/jpeg' });
    } finally {
      bitmap.close();
    }
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setNotice(null);
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    let succeeded = 0;
    // Upload sequentially so each request stays under Vercel's body cap and
    // we don't hammer the Drive API in parallel.
    for (const file of files) {
      try {
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('uploader_name', uploaderName.trim()); // server validates this too
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `Upload failed with status ${res.status}`);
        }
        succeeded += 1;
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploadProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
      }
    }

    setUploading(false);
    setUploadProgress(null);

    if (succeeded > 0) {
      setShowUploadForm(false);
      setUploaderName('');
      router.refresh();
    }

    // Show error only if nothing made it through; a partial success still
    // reads as success so the user knows their photos are coming.
    if (succeeded === 0) {
      setNotice('error');
    } else {
      setNotice('success');
      setTimeout(() => setNotice(null), 5000);
    }
  }

  function renderTile(photo: Photo, index: number, wrapperClass: string) {
    return (
      <div
        key={photo.src}
        onClick={() => setLightboxIndex(index)}
        className={wrapperClass}
      >
        {!loadedImages.has(index) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50">
            <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          loading={index < 4 ? 'eager' : 'lazy'}
          fetchPriority={index < 4 ? 'high' : 'auto'}
          onLoad={() => handleImageLoad(index)}
          ref={(el) => {
            // Cached images can finish loading before React attaches
            // onLoad (e.g. on refresh) — check directly so the
            // spinner always clears.
            if (el?.complete && el.naturalWidth > 0) handleImageLoad(index);
          }}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {photos.length > 0 ? (
        <>
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-lg border border-blue-200 bg-white p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setView('carousel')}
                aria-label="Horizontal view"
                aria-pressed={view === 'carousel'}
                className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                  view === 'carousel'
                    ? 'bg-blue-950 text-blue-50'
                    : 'text-blue-950 hover:bg-blue-50'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <rect x="3" y="7" width="6" height="10" rx="1" />
                  <rect x="11" y="7" width="6" height="10" rx="1" />
                  <path d="M20 9v6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setView('grid')}
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                className={`flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                  view === 'grid'
                    ? 'bg-blue-950 text-blue-50'
                    : 'text-blue-950 hover:bg-blue-50'
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <rect x="4" y="4" width="7" height="7" rx="1" />
                  <rect x="13" y="4" width="7" height="7" rx="1" />
                  <rect x="4" y="13" width="7" height="7" rx="1" />
                  <rect x="13" y="13" width="7" height="7" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          {view === 'carousel' ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <ArrowButton direction="left" onClick={() => scroll('left')} label="Scroll photos left" />

              <div
                ref={stripRef}
                onMouseEnter={() => (pausedRef.current = true)}
                onMouseLeave={() => (pausedRef.current = false)}
                onTouchStart={() => (pausedRef.current = true)}
                onTouchEnd={() => (pausedRef.current = false)}
                className="flex-1 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {photos.map((photo, index) =>
                  renderTile(
                    photo,
                    index,
                    'relative flex-shrink-0 w-64 sm:w-80 aspect-square snap-start rounded-xl overflow-hidden bg-white border border-blue-100 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all'
                  )
                )}
              </div>

              <ArrowButton direction="right" onClick={() => scroll('right')} label="Scroll photos right" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) =>
                renderTile(
                  photo,
                  index,
                  'relative aspect-square rounded-xl overflow-hidden bg-white border border-blue-100 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all'
                )
              )}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-xl mx-auto aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 border border-blue-100 shadow-sm flex items-center justify-center">
          <div className="text-center px-6">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12 mx-auto text-blue-300 mb-3"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <path d="M3 17l5-4 3 2.5L16 11l5 4" />
            </svg>
            <p className="text-sm text-blue-400">{t.comingSoon}</p>
            <p className="text-xs text-blue-400/80 italic mt-1">{t.comingSoonNote}</p>
          </div>
        </div>
      )}

      <div className="text-center mt-6">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {showUploadForm && !uploading ? (
          <form
            onSubmit={handleUploaderSubmit}
            className="inline-flex flex-col sm:flex-row items-center gap-3"
          >
            <label htmlFor="uploader-name" className="text-sm text-blue-950">
              {t.uploaderPrompt}
            </label>
            <input
              id="uploader-name"
              type="text"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder={t.uploaderPlaceholder}
              autoFocus
              required
              minLength={2}
              className="w-40 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 text-sm text-center"
            />
            <button
              type="submit"
              disabled={uploaderName.trim().length < 2}
              className="bg-blue-950 hover:bg-blue-900 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-blue-50 text-sm font-medium px-5 py-2 rounded-lg shadow transition-colors"
            >
              {t.uploaderContinue}
            </button>
          </form>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:bg-blue-900 text-blue-50 text-sm font-medium px-6 py-3 rounded-lg shadow transition-colors"
          >
            {uploading ? (
              <>
                {uploadProgress && uploadProgress.total > 1
                  ? `${t.uploading} ${uploadProgress.done}/${uploadProgress.total}`
                  : t.uploading}
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border-2 border-blue-300/30 rounded-full" />
                  <div className="absolute inset-0 border-2 border-blue-50 border-t-transparent rounded-full animate-spin" />
                </div>
              </>
            ) : (
              <>
                {t.uploadButton}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
                </svg>
              </>
            )}
          </button>
        )}

        {notice === 'success' && (
          <p className="text-sm text-green-700 mt-3">{t.uploadSuccess}</p>
        )}
        {notice === 'error' && (
          <p className="text-sm text-red-700 mt-3">{t.uploadError}</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightboxIndex].fullSrc ?? photos[lightboxIndex].src}
            alt={photos[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain"
          />

          {/* Uploader metadata — only for photos that have a DB record */}
          {photos[lightboxIndex].metadata && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg max-w-[90vw]"
            >
              <p className="text-sm">
                {t.uploadedBy}{' '}
                <span className="font-semibold">{photos[lightboxIndex].metadata!.uploader_name}</span>
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                {formatDate(photos[lightboxIndex].metadata!.created_at, locale)}
              </p>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
