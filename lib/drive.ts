import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';

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

// Cache the Drive listing for 60s so the page doesn't hit the Drive API
// on every visit. New uploads appear within a minute.
export const GALLERY_CACHE_TAG = 'gallery-photos';

export const listGalleryPhotos = unstable_cache(fetchGalleryPhotos, [GALLERY_CACHE_TAG], {
  revalidate: 60,
  tags: [GALLERY_CACHE_TAG],
});

export function drivePhotoUrl(id: string, width?: number): string {
  return width ? `/api/photos/${id}?w=${width}` : `/api/photos/${id}`;
}
