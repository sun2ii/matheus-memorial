import { NextRequest, NextResponse } from 'next/server';
import { getDrive } from '@/lib/drive';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^[\w-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  try {
    const drive = getDrive();
    const meta = await drive.files.get({
      fileId: id,
      fields: 'mimeType',
      supportsAllDrives: true,
    });

    const mimeType = meta.data.mimeType ?? '';
    if (!mimeType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 404 });
    }

    const file = await drive.files.get(
      { fileId: id, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' }
    );

    return new NextResponse(Buffer.from(file.data as ArrayBuffer), {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
