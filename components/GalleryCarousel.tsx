'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Photo = { src: string; alt: string };

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
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<'success' | 'error' | 'wrong-captcha' | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState('');

  const count = photos.length;
  const current = count > 0 ? photos[Math.min(index, count - 1)] : null;

  function prev() {
    setIndex((i) => (i - 1 + count) % count);
  }

  function next() {
    setIndex((i) => (i + 1) % count);
  }

  async function handleUploadClick() {
    setNotice(null);
    setAnswer('');
    try {
      const res = await fetch('/api/captcha');
      setChallenge(await res.json());
    } catch {
      setNotice('error');
    }
  }

  function handleCaptchaSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim()) return;
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !challenge) return;

    setNotice(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('captchaAnswer', answer.trim());
      formData.append('captchaToken', challenge.token);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.status === 401) {
        setNotice('wrong-captcha');
        await handleUploadClick();
        return;
      }
      if (!res.ok) throw new Error('upload failed');
      setChallenge(null);
      setAnswer('');
      setNotice('success');
      setIndex(0);
      router.refresh();
    } catch {
      setNotice('error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {current ? (
        <div className="flex items-center gap-3 sm:gap-5">
          <ArrowButton direction="left" onClick={prev} label="Previous photo" />

          <div className="relative flex-1 aspect-[4/3] rounded-2xl overflow-hidden bg-blue-950/5 border border-blue-100 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          <ArrowButton direction="right" onClick={next} label="Next photo" />
        </div>
      ) : (
        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 border border-blue-100 shadow-sm flex items-center justify-center">
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

      {count > 1 && (
        <p className="text-center text-sm text-blue-950/60 mt-4">
          {Math.min(index, count - 1) + 1} / {count}
        </p>
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
            onSubmit={handleCaptchaSubmit}
            className="inline-flex flex-col sm:flex-row items-center gap-3"
          >
            <label htmlFor="upload-captcha" className="text-sm text-blue-950">
              {t.captchaPrompt} <span className="font-semibold">{challenge.question} = ?</span>
            </label>
            <input
              id="upload-captcha"
              type="text"
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t.captchaPlaceholder}
              autoFocus
              className="w-28 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 text-sm text-center"
            />
            <button
              type="submit"
              className="bg-blue-950 hover:bg-blue-900 text-blue-50 text-sm font-medium px-5 py-2 rounded-lg shadow transition-colors"
            >
              {t.captchaContinue}
            </button>
          </form>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:bg-slate-400 text-blue-50 text-sm font-medium px-6 py-3 rounded-lg shadow transition-colors"
          >
            {uploading ? t.uploading : t.uploadButton}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
            </svg>
          </button>
        )}

        {notice === 'success' && (
          <p className="text-sm text-green-700 mt-3">{t.uploadSuccess}</p>
        )}
        {notice === 'error' && (
          <p className="text-sm text-red-700 mt-3">{t.uploadError}</p>
        )}
        {notice === 'wrong-captcha' && (
          <p className="text-sm text-red-700 mt-3">{t.captchaWrong}</p>
        )}
      </div>
    </div>
  );
}
