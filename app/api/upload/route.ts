import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getDrive, DRIVE_FOLDER_ID, GALLERY_CACHE_TAG } from '@/lib/drive';
import { sql } from '@/lib/db';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_NAME_LENGTH = 80;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // The uploader's name is required and stored as photo metadata. Validate
    // server-side — client-side checks can be bypassed by POSTing directly.
    const uploaderNameRaw = formData.get('uploader_name');
    if (typeof uploaderNameRaw !== 'string' || uploaderNameRaw.trim().length < 2) {
      return NextResponse.json({ error: 'Name required (min 2 characters)' }, { status: 400 });
    }
    const uploaderName = uploaderNameRaw.trim().slice(0, MAX_NAME_LENGTH);

    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 10MB' }, { status: 413 });
    }

    const drive = getDrive();
    const buffer = Buffer.from(await file.arrayBuffer());

    const created = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        parents: [DRIVE_FOLDER_ID],
      },
      media: { mimeType: file.type, body: Readable.from(buffer) },
      fields: 'id',
      supportsAllDrives: true,
    });

    const fileId = created.data.id;
    if (!fileId) throw new Error('Drive returned no file id');

    // Public read access so the gallery can display it
    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
      supportsAllDrives: true,
    });

    // Record uploader metadata. If this fails the photo still lives in Drive
    // and shows in the gallery — it just won't have an "uploaded by" overlay.
    try {
      await sql`
        INSERT INTO uploaded_photos (drive_file_id, uploader_name)
        VALUES (${fileId}, ${uploaderName})
      `;
    } catch (dbError) {
      console.error('Failed to store photo metadata:', dbError);
    }

    revalidateTag(GALLERY_CACHE_TAG, 'max'); // bust the 60s listing cache so the new photo shows immediately
    revalidatePath('/');
    return NextResponse.json({ id: fileId });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
