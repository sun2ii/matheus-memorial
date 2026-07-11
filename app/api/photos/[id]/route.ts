import { NextRequest, NextResponse } from 'next/server';
import { getDrive } from '@/lib/drive';

const CACHE_HEADERS = {
  // max-age: browser cache; s-maxage: Vercel CDN cache — after the
  // first visitor, images are served from the edge, not Drive.
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^[\w-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  // Optional ?w= for a resized version — dramatically smaller than the
  // multi-MB originals. Served from Google's thumbnail CDN.
  const wParam = req.nextUrl.searchParams.get('w');
  const width = wParam ? Math.min(Math.max(parseInt(wParam, 10) || 0, 0), 2048) : 0;

  try {
    const drive = getDrive();

    if (width > 0) {
      const meta = await drive.files.get({
        fileId: id,
        fields: 'thumbnailLink',
        supportsAllDrives: true,
      });
      const link = meta.data.thumbnailLink;
      if (link) {
        // thumbnailLink ends in "=s220"; swap in the size we want
        const sized = link.replace(/=s\d+(-c)?$/, `=s${width}`);
        const thumb = await fetch(sized);
        if (thumb.ok) {
          return new NextResponse(Buffer.from(await thumb.arrayBuffer()), {
            headers: {
              'Content-Type': thumb.headers.get('content-type') ?? 'image/jpeg',
              ...CACHE_HEADERS,
            },
          });
        }
      }
      // No thumbnail available — fall through to the original below.
    }

    // Full-size: fetch the file and read its type from the
    // response headers instead of a separate metadata call.
    const file = await drive.files.get(
      { fileId: id, alt: 'media', supportsAllDrives: true },
      { responseType: 'arraybuffer' }
    );

    const mimeType = String(file.headers['content-type'] ?? '');
    if (!mimeType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 404 });
    }

    return new NextResponse(Buffer.from(file.data as ArrayBuffer), {
      headers: { 'Content-Type': mimeType, ...CACHE_HEADERS },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
