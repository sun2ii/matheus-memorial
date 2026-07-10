import { Suspense } from 'react';
import Hero from '@/components/Hero';
import ServiceDetails from '@/components/ServiceDetails';
import LifeStory from '@/components/LifeStory';
import PhotoGallery from '@/components/PhotoGallery';
import GuestbookForm from '@/components/GuestbookForm';
import GuestbookMessages from '@/components/GuestbookMessages';
import { getDict } from '@/lib/i18n';

function GuestbookSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-blue-100 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-6"></div>
      <div className="space-y-4">
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}

export default async function Home() {
  const { locale, dict } = await getDict();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero locale={locale} dict={dict} />

      {/* Life story + timeline */}
      <LifeStory dict={dict} />

      {/* Photo gallery */}
      <PhotoGallery dict={dict} />

      {/* Guestbook */}
      <section id="guestbook" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          <GuestbookForm dict={dict.guestbook} />
          <Suspense fallback={<GuestbookSkeleton />}>
            <GuestbookMessages locale={locale} dict={dict} />
          </Suspense>
        </div>
      </section>

      {/* Service details / comfort / family note */}
      <ServiceDetails dict={dict} />
    </div>
  );
}
