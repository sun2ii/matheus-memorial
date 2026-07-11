'use client';

import { useState } from 'react';

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-300 ${
        copied
          ? 'border-green-500 bg-green-500 text-white scale-105 shadow-lg'
          : 'border-blue-600 bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100'
      }`}
    >
      {copied ? (
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          Berhasil disalin
        </span>
      ) : (
        label
      )}
    </button>
  );
}
