import { NextRequest, NextResponse } from 'next/server';
import { getDrive } from '@/lib/drive';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^[\w-]+$/.test(id)) {
    return new NextResponse('Invalid id', { status: 400 });
  }

  try {
    const drive = getDrive();

    // First get file metadata to know the size
    const meta = await drive.files.get({
      fileId: id,
      fields: 'size,mimeType',
      supportsAllDrives: true,
    });

    const fileSize = parseInt(meta.data.size || '0', 10);
    const mimeType = meta.data.mimeType || 'video/mp4';

    if (!mimeType.startsWith('video/')) {
      return new NextResponse('Not a video', { status: 404 });
    }

    // Check for range request (needed for video seeking)
    const range = req.headers.get('range');

    if (range) {
      // Handle range request for video seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = await drive.files.get(
        { fileId: id, alt: 'media', supportsAllDrives: true },
        {
          responseType: 'stream',
          headers: { Range: `bytes=${start}-${end}` }
        }
      );

      const stream = file.data as NodeJS.ReadableStream;
      const readable = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
          stream.on('end', () => controller.close());
          stream.on('error', (err: Error) => controller.error(err));
        },
      });

      return new NextResponse(readable, {
        status: 206,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(chunkSize),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
        },
      });
    }

    // Full file request
    const file = await drive.files.get(
      { fileId: id, alt: 'media', supportsAllDrives: true },
      { responseType: 'stream' }
    );

    const stream = file.data as NodeJS.ReadableStream;
    const readable = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err: Error) => controller.error(err));
      },
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Video fetch error:', err);
    return new NextResponse('Not found', { status: 404 });
  }
}
