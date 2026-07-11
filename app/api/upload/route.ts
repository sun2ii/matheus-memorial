import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getDrive, DRIVE_FOLDER_ID, GALLERY_CACHE_TAG } from '@/lib/drive';
import { verifyChallenge } from '@/lib/captcha';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const answer = formData.get('captchaAnswer');
    const token = formData.get('captchaToken');
    if (
      typeof answer !== 'string' ||
      typeof token !== 'string' ||
      !verifyChallenge(answer, token)
    ) {
      return NextResponse.json({ error: 'wrong-captcha' }, { status: 401 });
    }

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

    revalidateTag(GALLERY_CACHE_TAG, 'max'); // bust the 60s listing cache so the new photo shows immediately
    revalidatePath('/');
    return NextResponse.json({ id: fileId });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
