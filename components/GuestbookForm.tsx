'use client';

import { useTransition, useState, useRef } from 'react';
import { submitGuestbookEntry } from '@/app/actions';

type ReviewData = {
  visitor_name: string;
  visitor_email: string;
  message: string;
};

export default function GuestbookForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewData | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    setReview({
      visitor_name: (formData.get('visitor_name') as string) ?? '',
      visitor_email: (formData.get('visitor_email') as string) ?? '',
      message: (formData.get('message') as string) ?? '',
    });
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit message');
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100">
      <h3 className="font-serif text-2xl text-blue-950 text-center mb-1">
        Share a Memory, Prayer, or Message of Love
      </h3>
      <div className="flex justify-center mb-6">
        <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
      </div>

      {/* Review step: shown after Submit, before anything is sent */}
      {review && (
        <div className="space-y-5">
          <p className="text-sm text-slate-600 text-center">
            Please review your message before sending. It will be visible to
            everyone who visits this memorial.
          </p>

          <div className="bg-[#fdfbf5] border border-amber-200 rounded-lg p-5">
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
              Go Back &amp; Edit
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
              {isPending ? 'Sending...' : 'Confirm & Send'}
            </button>
          </div>
        </div>
      )}

      {/* Form stays mounted while reviewing so "Go Back & Edit" keeps the values */}
      <form ref={formRef} onSubmit={handleSubmit} className={review ? 'hidden' : 'space-y-5'}>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label htmlFor="visitor_name" className="block text-sm font-medium text-slate-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="visitor_name"
              name="visitor_name"
              required
              disabled={isPending}
              className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="visitor_email" className="block text-sm font-medium text-slate-700 mb-2">
              Email <span className="text-slate-400 text-xs">(optional)</span>
            </label>
            <input
              type="email"
              id="visitor_email"
              name="visitor_email"
              disabled={isPending}
              className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Your Memory / Prayer <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            disabled={isPending}
            rows={5}
            className="block w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 placeholder:text-slate-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors resize-none"
            placeholder="Share your thoughts, memories, or message..."
          />
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Thank you for sharing your memory.</p>
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
          {isPending ? 'Sending...' : 'Review Message'}
        </button>
      </form>
    </div>
  );
}
