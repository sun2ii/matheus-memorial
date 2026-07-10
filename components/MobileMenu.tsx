'use client';

import { useState } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Locale } from '@/lib/i18n';

type NavLink = { href: string; label: string; highlight?: boolean };

export default function MobileMenu({
  locale,
  links,
}: {
  locale: Locale;
  links: NavLink[];
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
                  className={
                    link.highlight
                      ? "py-3 px-3 my-1.5 text-[15px] font-medium bg-pink-100 text-pink-900 hover:bg-pink-200 rounded-lg transition-colors"
                      : "py-3 text-[15px] text-blue-950/90 hover:text-blue-950 border-b border-amber-100/70 transition-colors"
                  }
                >
                  {link.label}
                </a>
              ))}

              <div className="flex items-center py-4">
                <LanguageSwitcher locale={locale} />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
