'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { submitGuestbookEntry } from '@/app/actions';
import { guestbookSchema } from '@/lib/validations';
import type { Dict } from '@/lib/i18n';

type GuestbookDict = Dict['guestbook'];

type ReviewData = {
  visitor_name: string;
  visitor_email: string;
  message: string;
};

export default function GuestbookForm({ dict }: { dict: GuestbookDict }) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Error banners fade away on their own after 5 seconds
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const data = {
      visitor_name: (formData.get('visitor_name') as string) ?? '',
      visitor_email: (formData.get('visitor_email') as string) ?? '',
      message: (formData.get('message') as string) ?? '',
    };

    // Validate before opening the review modal so errors read like sentences
    const result = guestbookSchema.safeParse(data);
    if (!result.success) {
      const field = result.error.issues[0]?.path[0];
      setError(
        field === 'visitor_name'
          ? dict.errorName
          : field === 'visitor_email'
            ? dict.errorEmail
            : field === 'message'
              ? dict.errorMessage
              : dict.errorGeneric
      );
      return;
    }

    setReview(data);
  }

  function handleConfirm() {
    if (!review) return;
    setError(null);

    const formData = new FormData();
    formData.set('visitor_name', review.visitor_name);
    formData.set('visitor_email', review.visitor_email);
    formData.set('message', review.message);

    startTransition(async () => {
      try {
        await submitGuestbookEntry(formData);
        setReview(null);
        setSuccess(true);
        formRef.current?.reset();
        setTimeout(() => setSuccess(false), 5000);
      } catch {
        setError(dict.errorSubmit);
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
      <h3 className="font-serif text-2xl text-blue-950 text-center mb-1">{dict.formTitle}</h3>
      <div className="flex justify-center mb-6">
        <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
      </div>

      {/* Review modal: shown after Submit, nothing is sent until confirmed */}
      {review && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={dict.reviewTitle}
        >
          <div
            className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
            onClick={() => !isPending && setReview(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
            <h4 className="font-serif text-xl text-blue-950 text-center">{dict.reviewTitle}</h4>
            <p className="text-sm text-slate-600 text-center">{dict.reviewSubtitle}</p>

            <div className="bg-[#fdfbf5] border border-amber-200 rounded-lg p-5 max-h-60 overflow-y-auto">
              <p className="font-medium text-blue-950">{review.visitor_name}</p>
              {review.visitor_email && (
                <p className="text-sm text-slate-500">{review.visitor_email}</p>
              )}
              <p className="mt-3 text-slate-700 whitespace-pre-wrap">{review.message}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setReview(null)}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 disabled:cursor-not-allowed text-blue-950 font-semibold py-3 px-6 rounded-lg border border-blue-200 transition-colors duration-200"
              >
                {dict.goBack}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                {isPending ? dict.sending : dict.confirmSend}
              </button>
            </div>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label htmlFor="visitor_name" className="block text-sm font-medium text-slate-700 mb-2">
              {dict.nameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="visitor_name"
              name="visitor_name"
              required
              disabled={isPending}
              className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              placeholder={dict.namePlaceholder}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="visitor_email" className="block text-sm font-medium text-slate-700 mb-2">
              {dict.emailLabel} <span className="text-slate-400 text-xs">{dict.emailOptional}</span>
            </label>
            <input
              type="email"
              id="visitor_email"
              name="visitor_email"
              disabled={isPending}
              className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              placeholder={dict.emailPlaceholder}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            {dict.messageLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            disabled={isPending}
            rows={5}
            className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
            placeholder={dict.messagePlaceholder}
          />
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-medium">{dict.success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          {isPending ? dict.sending : dict.reviewButton}
        </button>
      </form>
    </div>
  );
}
