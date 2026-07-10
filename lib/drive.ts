import { google } from 'googleapis';

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

export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
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

export function drivePhotoUrl(id: string): string {
  return `/api/photos/${id}`;
}
