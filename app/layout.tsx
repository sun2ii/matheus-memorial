import type { Metadata } from "next";
import Image from "next/image";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { getDict, type Dict, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WelcomeModal from "@/components/WelcomeModal";
import enMessages from "@/messages/en.json";
import idMessages from "@/messages/id.json";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Matheus Memorial",
  description:
    "In loving memory of Matheus Basuni (February 25, 1960 - July 6, 2026). Join us in celebrating his life and legacy.",
  openGraph: {
    title: "Matheus Memorial",
    description:
      "In loving memory of Matheus Basuni (1960-2026). Celebrating his life and legacy.",
    type: "website",
  },
};

function DoveIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/dove.png"
      alt=""
      width={28}
      height={28}
      className={className}
      aria-hidden="true"
    />
  );
}

function Navigation({ locale, dict }: { locale: Locale; dict: Dict }) {
  const links = [
    { href: "#story", label: dict.nav.story },
    { href: "#home", label: dict.nav.rsvp },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#guestbook", label: dict.nav.guestbook },
    { href: "#service", label: dict.nav.service },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf5]/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <DoveIcon className="w-7 h-7" />
            <span className="leading-tight">
              <span className="block text-[11px] italic text-blue-900/70 font-serif">
                {dict.nav.inLovingMemoryOf}
              </span>
              <span className="block text-lg font-serif text-blue-950 group-hover:text-blue-800 transition-colors">
                Matheus Basuni
              </span>
            </span>
          </a>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {links.map((link) => (
              <a
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="text-[13px] whitespace-nowrap text-blue-950/80 hover:text-blue-950 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#guestbook"
              className="inline-flex items-center gap-2 whitespace-nowrap bg-blue-950 hover:bg-blue-900 text-blue-50 text-[13px] font-medium px-4 py-2 rounded-lg shadow transition-colors"
            >
              {dict.nav.leaveAMemory}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
              </svg>
            </a>
            <LanguageSwitcher locale={locale} />
          </div>

          {/* Mobile: language switcher + guestbook button */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher locale={locale} />
            <a
              href="#guestbook"
              className="inline-flex items-center gap-2 bg-blue-950 text-blue-50 text-sm font-medium px-4 py-2 rounded-lg"
            >
              {dict.nav.leaveAMemory}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer({ dict }: { dict: Dict }) {
  const links = [
    { href: "#home", label: dict.nav.home },
    { href: "#story", label: dict.nav.story },
    { href: "#gallery", label: dict.nav.gallery },
    { href: "#guestbook", label: dict.nav.guestbook },
    { href: "#service", label: dict.nav.service },
  ];

  return (
    <footer className="bg-blue-950 text-blue-100 pt-10 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <DoveIcon className="w-7 h-7" />
            <div>
              <p className="font-serif text-lg">
                {dict.footer.inLovingMemoryOf} <span className="text-white">Matheus Basuni</span>
              </p>
              <p className="text-xs italic text-blue-300">{dict.footer.rememberedWithLove}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-blue-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-blue-300/70 mt-8">{dict.footer.rights}</p>
      </div>
    </footer>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getDict();

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#f8fafc]">
        <Navigation locale={locale} dict={dict} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer dict={dict} />
        <WelcomeModal locale={locale} dicts={{ en: enMessages, id: idMessages }} />
      </body>
    </html>
  );
}
