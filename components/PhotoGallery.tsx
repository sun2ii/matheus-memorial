import fs from 'fs';
import path from 'path';
import GalleryCarousel from '@/components/GalleryCarousel';
import { listGalleryPhotos, drivePhotoUrl } from '@/lib/drive';
import type { Dict, Locale } from '@/lib/i18n';

function getLocalPhotos(): string[] {
  try {
    const dir = path.join(process.cwd(), 'public', 'images', 'gallery');
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/images/gallery/${f}`);
  } catch {
    return [];
  }
}

export default async function PhotoGallery({ dict, locale }: { dict: Dict; locale: Locale }) {
  const t = dict.gallery;

  const drivePhotos = await listGalleryPhotos();
  const photos = [
    ...getLocalPhotos().map((src) => ({ src, fullSrc: src, alt: t.photoAlt })),
    ...drivePhotos.map((p) => ({
      // Small thumbnail for the carousel tile, larger version for the lightbox
      src: drivePhotoUrl(p.id, 640),
      fullSrc: drivePhotoUrl(p.id, 1600),
      alt: t.photoAlt,
      metadata: p.metadata,
    })),
  ];

  return (
    <section id="gallery" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#eff6ff]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-blue-950 text-center mb-2">
          {t.title}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-12">
          <span className="h-px w-10 bg-amber-400" />
          <span className="w-1.5 h-1.5 rotate-45 bg-amber-500" />
          <span className="h-px w-10 bg-amber-400" />
        </div>

        <GalleryCarousel
          photos={photos}
          locale={locale}
          t={{
            photoAlt: t.photoAlt,
            comingSoon: t.comingSoon,
            comingSoonNote: t.comingSoonNote,
            uploadButton: t.uploadButton,
            uploading: t.uploading,
            uploadSuccess: t.uploadSuccess,
            uploadError: t.uploadError,
            uploaderPrompt: t.uploaderPrompt,
            uploaderPlaceholder: t.uploaderPlaceholder,
            uploaderContinue: t.uploaderContinue,
            uploaderError: t.uploaderError,
            uploadedBy: t.uploadedBy,
          }}
        />
      </div>
    </section>
  );
}
