import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';
import { sql } from '@/lib/db';

export const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID ?? '';

function getCredentials(): { client_email: string; private_key: string } {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) {
    throw new Error('Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY env vars');
  }
  return { client_email: email, private_key: key.replace(/\\n/g, '\n') };
}

export function getDrive() {
  const creds = getCredentials();
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  return google.drive({ version: 'v3', auth });
}

export type GalleryPhoto = { id: string; name: string };

export type PhotoMetadata = {
  uploader_name: string;
  created_at: Date;
};

export type PhotoWithMetadata = GalleryPhoto & {
  metadata?: PhotoMetadata; // Optional — legacy photos have no DB row
};

async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  if (!DRIVE_FOLDER_ID) return [];
  try {
    const drive = getDrive();
    const res = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc',
      pageSize: 200,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    return (res.data.files ?? []).flatMap((f) =>
      f.id ? [{ id: f.id, name: f.name ?? 'photo' }] : []
    );
  } catch (error) {
    console.error('Failed to list gallery photos:', error);
    return [];
  }
}

// Join the Drive listing with uploader metadata from the database. Legacy
// photos with no DB row simply come back without a `metadata` field.
async function fetchPhotoMetadata(fileIds: string[]): Promise<Map<string, PhotoMetadata>> {
  if (fileIds.length === 0) return new Map();
  try {
    const rows = (await sql`
      SELECT drive_file_id, uploader_name, created_at
      FROM uploaded_photos
      WHERE drive_file_id = ANY(${fileIds})
    `) as Array<{ drive_file_id: string; uploader_name: string; created_at: Date }>;

    return new Map(
      rows.map((r) => [r.drive_file_id, { uploader_name: r.uploader_name, created_at: r.created_at }])
    );
  } catch (error) {
    console.error('Failed to fetch photo metadata:', error);
    return new Map();
  }
}

async function fetchGalleryPhotosWithMetadata(): Promise<PhotoWithMetadata[]> {
  const photos = await fetchGalleryPhotos();
  const metadataMap = await fetchPhotoMetadata(photos.map((p) => p.id));
  return photos.map((photo) => ({ ...photo, metadata: metadataMap.get(photo.id) }));
}

// Cache the Drive listing + metadata for 60s so the page doesn't hit the Drive
// API or DB on every visit. New uploads appear within a minute.
export const GALLERY_CACHE_TAG = 'gallery-photos';

export const listGalleryPhotos = unstable_cache(fetchGalleryPhotosWithMetadata, [GALLERY_CACHE_TAG], {
  revalidate: 60,
  tags: [GALLERY_CACHE_TAG],
});

export function drivePhotoUrl(id: string, width?: number): string {
  return width ? `/api/photos/${id}?w=${width}` : `/api/photos/${id}`;
}
