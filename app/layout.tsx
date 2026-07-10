import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Matheus Basuni - Celebration of Life",
  description:
    "In loving memory of Matheus Basuni (February 25, 1960 - July 6, 2026). Join us in celebrating his life and legacy.",
  openGraph: {
    title: "Matheus Basuni - Celebration of Life",
    description:
      "In loving memory of Matheus Basuni (1960-2026). Celebrating his life and legacy.",
    type: "website",
  },
};

function DoveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.5 5.5c-1.2-.6-2.7-.4-3.7.5l-2.4 2.1c-1.6-2.6-4.4-4.3-7.6-4.3-.5 0-.9.4-.9.9 0 2.1.9 4 2.3 5.4L2.5 15.3c-.3.3-.4.8-.1 1.1.9 1.2 2.3 1.9 3.9 1.9h.4c.4 2 1.7 3.6 3.5 4.5.4.2.9 0 1.1-.4l1.5-3.3c3.9-.5 7.1-3.4 8.1-7.2l.9-3.3c.2-1.1-.4-2.5-1.3-3.1z" />
    </svg>
  );
}

function Navigation() {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#story", label: "His Story" },
    { href: "#gallery", label: "Gallery" },
    { href: "#guestbook", label: "Guestbook" },
    { href: "#service", label: "Service Details" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf5]/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <DoveIcon className="w-7 h-7 text-amber-500" />
            <span className="leading-tight">
              <span className="block text-[11px] italic text-blue-900/70 font-serif">
                In Loving Memory of
              </span>
              <span className="block text-lg font-serif text-blue-950 group-hover:text-blue-800 transition-colors">
                Matheus Basuni
              </span>
            </span>
          </a>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-blue-950/80 hover:text-blue-950 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#guestbook"
              className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-blue-50 text-sm font-medium px-5 py-2.5 rounded-lg shadow transition-colors"
            >
              Leave a Memory
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 21C7 16.5 3 13.2 3 9.1 3 6.3 5.2 4 8 4c1.6 0 3.1.8 4 2 0.9-1.2 2.4-2 4-2 2.8 0 5 2.3 5 5.1 0 4.1-4 7.4-9 11.9z" />
              </svg>
            </a>
          </div>

          {/* Mobile: just the button */}
          <a
            href="#guestbook"
            className="lg:hidden inline-flex items-center gap-2 bg-blue-950 text-blue-50 text-sm font-medium px-4 py-2 rounded-lg"
          >
            Leave a Memory
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#story", label: "His Story" },
    { href: "#gallery", label: "Gallery" },
    { href: "#guestbook", label: "Guestbook" },
    { href: "#service", label: "Service Details" },
  ];

  return (
    <footer className="bg-blue-950 text-blue-100 pt-10 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <DoveIcon className="w-7 h-7 text-amber-400" />
            <div>
              <p className="font-serif text-lg">
                In Loving Memory of <span className="text-white">Matheus Basuni</span>
              </p>
              <p className="text-xs italic text-blue-300">Forever remembered with love.</p>
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
        <p className="text-center text-xs text-blue-300/70 mt-8">
          © 2026 Matheus Basuni Memorial. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#f8fafc]">
        <Navigation />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
