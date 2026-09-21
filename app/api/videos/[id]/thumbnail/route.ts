import { NextRequest, NextResponse } from 'next/server';
import { getDrive } from '@/lib/drive';

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
};

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

    // Get video thumbnail from Google Drive
    const meta = await drive.files.get({
      fileId: id,
      fields: 'thumbnailLink',
      supportsAllDrives: true,
    });

    const thumbnailLink = meta.data.thumbnailLink;
    if (!thumbnailLink) {
      return new NextResponse('No thumbnail', { status: 404 });
    }

    // Get a larger thumbnail (default is small)
    const largerThumbnail = thumbnailLink.replace(/=s\d+/, '=s800');

    // Fetch and proxy the thumbnail
    const response = await fetch(largerThumbnail);
    if (!response.ok) {
      return new NextResponse('Thumbnail fetch failed', { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        ...CACHE_HEADERS,
      },
    });
  } catch (err) {
    console.error('Thumbnail fetch error:', err);
    return new NextResponse('Not found', { status: 404 });
  }
}
