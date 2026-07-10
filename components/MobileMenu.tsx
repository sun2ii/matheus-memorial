'use client';

import { useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/lib/i18n';

type NavLink = { href: string; label: string };

export default function MobileMenu({
  locale,
  links,
  leaveAMemory,
}: {
  locale: Locale;
  links: NavLink[];
  leaveAMemory: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="p-2 -mr-2 text-blue-950"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop: tap outside to close */}
          <div
            className="fixed inset-0 top-16 bg-blue-950/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div className="absolute top-16 left-0 right-0 bg-[#fdfbf5] border-b border-amber-100 shadow-lg">
            <nav className="px-4 py-3 flex flex-col">
              {links.map((link) => (
                <a
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[15px] text-blue-950/90 hover:text-blue-950 border-b border-amber-100/70 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center justify-between gap-4 py-4">
                <LanguageSwitcher locale={locale} />
                <a
                  href="#guestbook"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-blue-50 text-sm font-medium px-4 py-2.5 rounded-lg shadow transition-colors"
                >
                  {leaveAMemory}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
                  </svg>
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
