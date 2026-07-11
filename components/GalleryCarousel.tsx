'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Photo = { src: string; fullSrc?: string; alt: string };

type Strings = {
  photoAlt: string;
  comingSoon: string;
  comingSoonNote: string;
  uploadButton: string;
  uploading: string;
  uploadSuccess: string;
  uploadError: string;
  captchaPrompt: string;
  captchaPlaceholder: string;
  captchaContinue: string;
  captchaWrong: string;
};

type Challenge = { question: string; token: string };

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

export default function GalleryCarousel({ photos, t }: { photos: Photo[]; t: Strings }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<'success' | 'error' | 'wrong-captcha' | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

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

  async function handleUploadClick() {
    setNotice(null);
    setAnswer('');
    setChallenge({ question: '', token: 'passphrase' });
  }

  function handlePassphraseSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const passphrase = answer.trim().toLowerCase();
    if (passphrase !== 'love to mamat') {
      setNotice('wrong-captcha');
      return;
    }
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
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setNotice(null);
    setUploading(true);
    try {
      // Compress the image before upload
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('passphrase', answer); // server verifies this too
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Upload failed with status ${res.status}`);
      }
      setChallenge(null);
      setAnswer('');
      setNotice('success');
      router.refresh();

      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setNotice(null);
      }, 5000);
    } catch (err) {
      console.error('Upload error:', err);
      setNotice('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {photos.length > 0 ? (
        <div className="flex items-center gap-3 sm:gap-4">
          <ArrowButton direction="left" onClick={() => scroll('left')} label="Scroll photos left" />

          <div
            ref={stripRef}
            className="flex-1 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {photos.map((photo, index) => (
              <div
                key={photo.src}
                onClick={() => setLightboxIndex(index)}
                className="relative flex-shrink-0 w-64 sm:w-80 aspect-square snap-start rounded-xl overflow-hidden bg-white border border-blue-100 shadow-md cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
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
            ))}
          </div>

          <ArrowButton direction="right" onClick={() => scroll('right')} label="Scroll photos right" />
        </div>
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
          onChange={handleFileChange}
          className="hidden"
        />
        {challenge && !uploading ? (
          <form
            onSubmit={handlePassphraseSubmit}
            className="inline-flex flex-col sm:flex-row items-center gap-3"
          >
            <label htmlFor="upload-passphrase" className="text-sm text-blue-950">
              Type <span className="font-semibold">&ldquo;love to mamat&rdquo;</span> to continue
            </label>
            <input
              id="upload-passphrase"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="love to mamat"
              autoFocus
              className="w-40 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 text-sm text-center"
            />
            <button
              type="submit"
              className="bg-blue-950 hover:bg-blue-900 text-blue-50 text-sm font-medium px-5 py-2 rounded-lg shadow transition-colors"
            >
              Continue
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
                {t.uploading}
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
        {notice === 'wrong-captcha' && (
          <p className="text-sm text-red-700 mt-3">Wrong passphrase. Please try again.</p>
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
