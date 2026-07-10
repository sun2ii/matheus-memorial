import type { Metadata } from "next";
import Image from "next/image";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { getDict, type Dict, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileMenu from "@/components/MobileMenu";
import WelcomeModal from "@/components/WelcomeModal";
import enMessages from "@/messages/en.json";
import idMessages from "@/messages/id.json";

const cinzel = Cinzel({
  variable: "--font-cinzel",
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

function BrandIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/thumbs-up-icon.png"
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
    { href: "#guestbook", label: dict.nav.guestbook },
    { href: "#donations", label: dict.nav.donations, highlight: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf5]/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <BrandIcon className="w-7 h-7" />
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
                className={
                  link.highlight
                    ? "text-[13px] whitespace-nowrap font-medium bg-pink-100 text-pink-900 hover:bg-pink-200 px-3 py-1.5 rounded-full transition-colors"
                    : "text-[13px] whitespace-nowrap text-blue-950/80 hover:text-blue-950 transition-colors"
                }
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher locale={locale} />
          </div>

          {/* Mobile: hamburger menu */}
          <MobileMenu locale={locale} links={links} />
        </div>
      </div>
    </nav>
  );
}

function Footer({ dict }: { dict: Dict }) {
  const links = [
    { href: "#home", label: dict.nav.home },
    { href: "#story", label: dict.nav.story },
    { href: "#guestbook", label: dict.nav.guestbook },
    { href: "#donations", label: dict.nav.donations },
  ];

  return (
    <footer className="bg-blue-950 text-blue-100 pt-10 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandIcon className="w-7 h-7" />
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
    <html lang={locale} className={`${cinzel.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#f8fafc]">
        <Navigation locale={locale} dict={dict} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer dict={dict} />
        <WelcomeModal locale={locale} dicts={{ en: enMessages, id: idMessages }} />
      </body>
    </html>
  );
}
