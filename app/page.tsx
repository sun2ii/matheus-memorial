import { Suspense } from 'react';
import Hero from '@/components/Hero';
import VideoTribute from '@/components/VideoTribute';
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

      {/* Video tribute */}
      <VideoTribute dict={dict} />

      {/* Life story + timeline */}
      <LifeStory dict={dict} />

      {/* Photo gallery — Suspense so the page shell isn't blocked by the Drive listing */}
      <Suspense
        fallback={
          <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#eff6ff]">
            <div className="max-w-7xl mx-auto animate-pulse">
              <div className="h-9 bg-blue-100 rounded w-56 mx-auto mb-12" />
              <div className="flex gap-4 justify-center overflow-hidden">
                <div className="w-64 sm:w-80 aspect-square rounded-xl bg-blue-100 flex-shrink-0" />
                <div className="w-64 sm:w-80 aspect-square rounded-xl bg-blue-100 flex-shrink-0 hidden sm:block" />
                <div className="w-64 sm:w-80 aspect-square rounded-xl bg-blue-100 flex-shrink-0 hidden lg:block" />
              </div>
            </div>
          </section>
        }
      >
        <PhotoGallery dict={dict} locale={locale} />
      </Suspense>

      {/* Guestbook */}
      <section id="guestbook" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-stretch">
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
