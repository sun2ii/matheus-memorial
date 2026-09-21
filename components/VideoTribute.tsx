import { listGalleryVideos, driveVideoUrl, driveVideoThumbnailUrl } from '@/lib/drive';
import type { Dict } from '@/lib/i18n';
import VideoTributeClient from './VideoTributeClient';

export type Video = {
  id: string;
  name: string;
  src: string;
  poster: string;
  title: string;
  isVertical: boolean;
};

// Define the exact videos we want and their order
const VIDEO_CONFIG: { pattern: string; title: string; order: number; isVertical: boolean; customPoster?: string }[] = [
  { pattern: 'dad-video', title: "Dad's Tribute", order: 1, isVertical: false, customPoster: '/poster/dad-tribute.png' },
  { pattern: 'dad-final-tribute', title: "Dad's Tribute #2", order: 2, isVertical: false, customPoster: '/poster/dad-tribute-2.png' },
  // YouTube slideshow is order 3 (handled in client)
  { pattern: 'piano-1', title: '#1. Raise Me Up - Josh Groban', order: 4, isVertical: true },
  { pattern: 'piano-2', title: '#2. Monsters - James Blunt', order: 5, isVertical: true },
  { pattern: 'piano-3', title: '#3. What a Wonderful World - Louis Armstrong', order: 6, isVertical: true },
  { pattern: 'ben', title: "Ben's Eulogy", order: 7, isVertical: true },
  { pattern: 'mom', title: "Mom's Eulogy", order: 8, isVertical: true },
];

function getVideoConfig(filename: string): { title: string; order: number; isVertical: boolean; customPoster?: string } | null {
  const lower = filename.toLowerCase();
  for (const config of VIDEO_CONFIG) {
    if (lower.includes(config.pattern)) {
      return { title: config.title, order: config.order, isVertical: config.isVertical, customPoster: config.customPoster };
    }
  }
  return null; // Skip videos not in our list
}

export default async function VideoTribute({ dict }: { dict: Dict }) {
  const driveVideos = await listGalleryVideos();

  // Filter and sort videos according to our config
  const videos: (Video & { order: number })[] = driveVideos
    .map((v) => {
      const config = getVideoConfig(v.name);
      if (!config) return null;
      return {
        id: v.id,
        name: v.name,
        src: driveVideoUrl(v.id),
        poster: config.customPoster || driveVideoThumbnailUrl(v.id),
        title: config.title,
        isVertical: config.isVertical,
        order: config.order,
      };
    })
    .filter((v): v is Video & { order: number } => v !== null)
    .sort((a, b) => a.order - b.order);

  return <VideoTributeClient dict={dict} videos={videos} />;
}
