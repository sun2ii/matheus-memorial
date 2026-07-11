# Photo Upload Metadata Feature - Implementation Guide

## Overview

Replace passphrase-based upload with uploader name input, store metadata in database, and display "Uploaded by [name] at [timestamp]" in photo lightbox with timezone formatting (PST/WIB).

## Architecture

```
Upload Flow:
  User clicks "Add Photo" → Enter name → Select file → Compress → Upload
    ↓
  API validates name → Upload to Drive → Insert metadata to DB → Return success
    ↓
  Page refresh → JOIN Drive photos with DB metadata → Display in carousel
    ↓
  Click photo → Lightbox shows metadata overlay (if exists)
```

**Core Primitives:**
- **Google Drive**: Immutable file storage (unchanged)
- **Database**: Metadata log (uploader_name, created_at)
- **Join Operation**: LEFT JOIN Drive listing + DB metadata by file_id

**Invariants:**
- Drive file_id is join key (never changes)
- Metadata optional (legacy photos have none)
- Database stores UTC timestamps
- Display formats to locale timezone (PST or WIB)

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS uploaded_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_file_id TEXT NOT NULL UNIQUE,
  uploader_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uploaded_photos_drive_file_id
  ON uploaded_photos(drive_file_id);

CREATE INDEX IF NOT EXISTS idx_uploaded_photos_created_at
  ON uploaded_photos(created_at DESC);
```

Run in Neon console, then add to `lib/database-setup.sql`.

## Type System

```typescript
// lib/drive.ts
export type PhotoMetadata = {
  uploader_name: string;
  created_at: Date;
};

export type PhotoWithMetadata = GalleryPhoto & {
  metadata?: PhotoMetadata;  // Optional for legacy photos
};

// components/GalleryCarousel.tsx
type Photo = {
  src: string;
  fullSrc?: string;
  alt: string;
  metadata?: PhotoMetadata;
};
```

## Implementation Steps

### 1. Database Migration
- Run schema in Neon console
- Append to `lib/database-setup.sql`

### 2. Shared Formatting Utility
**Create:** `lib/formatting.ts`

Extract `formatDate()` from `GuestbookMessages.tsx` (lines 26-71):

```typescript
import type { Locale } from './i18n';

export function formatDate(date: Date | string, locale: Locale): string {
  const timezone = locale === 'id' ? 'Asia/Jakarta' : 'America/Los_Angeles';

  // Reinterpret Postgres timestamp as UTC
  let timestamp: Date;
  if (typeof date === 'string') {
    let iso = date.trim().replace(' ', 'T');
    if (/[+-]\d{2}$/.test(iso)) iso += ':00';
    const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(iso);
    timestamp = new Date(hasZone ? iso : iso + 'Z');
  } else {
    timestamp = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
    );
  }

  const dateStr = timestamp.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone,
  });

  const timeStr = timestamp.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  const tzLabel = locale === 'id' ? 'WIB 🇮🇩' : 'PST 🇺🇸';
  return `${dateStr} at ${timeStr} ${tzLabel}`;
}
```

**Update:** `components/GuestbookMessages.tsx`
```typescript
import { formatDate } from '@/lib/formatting';
// Remove local formatDate function
```

### 3. Photo Retrieval with Metadata
**Update:** `lib/drive.ts`

Add metadata fetching:

```typescript
import { sql } from '@/lib/db';

export type PhotoMetadata = {
  uploader_name: string;
  created_at: Date;
};

export type PhotoWithMetadata = GalleryPhoto & {
  metadata?: PhotoMetadata;
};

async function fetchPhotoMetadata(fileIds: string[]): Promise<Map<string, PhotoMetadata>> {
  if (fileIds.length === 0) return new Map();

  try {
    const rows = await sql<Array<{ drive_file_id: string; uploader_name: string; created_at: Date }>>`
      SELECT drive_file_id, uploader_name, created_at
      FROM uploaded_photos
      WHERE drive_file_id = ANY(${fileIds})
    `;

    return new Map(
      rows.map(r => [r.drive_file_id, { uploader_name: r.uploader_name, created_at: r.created_at }])
    );
  } catch (error) {
    console.error('Failed to fetch photo metadata:', error);
    return new Map();
  }
}

async function fetchGalleryPhotosWithMetadata(): Promise<PhotoWithMetadata[]> {
  const photos = await fetchGalleryPhotos();
  const fileIds = photos.map(p => p.id);
  const metadataMap = await fetchPhotoMetadata(fileIds);

  return photos.map(photo => ({
    ...photo,
    metadata: metadataMap.get(photo.id),
  }));
}

export const listGalleryPhotos = unstable_cache(
  fetchGalleryPhotosWithMetadata,
  [GALLERY_CACHE_TAG],
  { revalidate: 60, tags: [GALLERY_CACHE_TAG] }
);
```

### 4. Upload API Changes
**Update:** `app/api/upload/route.ts`

Replace passphrase validation with uploader_name, add DB insert:

```typescript
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // NEW: Validate uploader_name instead of passphrase
    const uploaderName = formData.get('uploader_name');
    if (typeof uploaderName !== 'string' || uploaderName.trim().length < 2) {
      return NextResponse.json({ error: 'Name required (min 2 characters)' }, { status: 400 });
    }

    const file = formData.get('file');
    // ... existing file validation ...

    // Upload to Drive
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

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
      supportsAllDrives: true,
    });

    // NEW: Insert metadata into database
    await sql`
      INSERT INTO uploaded_photos (drive_file_id, uploader_name)
      VALUES (${fileId}, ${uploaderName.trim()})
    `;

    revalidateTag(GALLERY_CACHE_TAG, 'max');
    revalidatePath('/');
    return NextResponse.json({ id: fileId });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
```

### 5. Localization
**Update:** `messages/en.json`

```json
{
  "gallery": {
    "uploaderPrompt": "Who is uploading the photo?",
    "uploaderPlaceholder": "Your name",
    "uploadedBy": "Uploaded by"
  }
}
```

**Update:** `messages/id.json`

```json
{
  "gallery": {
    "uploaderPrompt": "Siapa yang mengunggah foto ini?",
    "uploaderPlaceholder": "Nama Anda",
    "uploadedBy": "Diunggah oleh"
  }
}
```

### 6. PhotoGallery Component
**Update:** `components/PhotoGallery.tsx`

```typescript
import type { Dict, Locale } from '@/lib/i18n';

export default async function PhotoGallery({
  dict,
  locale  // NEW
}: {
  dict: Dict;
  locale: Locale;  // NEW
}) {
  const t = dict.gallery;

  const drivePhotos = await listGalleryPhotos();
  const photos = [
    ...getLocalPhotos().map((src) => ({ src, fullSrc: src, alt: t.photoAlt })),
    ...drivePhotos.map((p) => ({
      src: drivePhotoUrl(p.id, 640),
      fullSrc: drivePhotoUrl(p.id, 1600),
      alt: t.photoAlt,
      metadata: p.metadata,  // NEW
    })),
  ];

  return (
    <section id="gallery" className="...">
      {/* ... */}
      <GalleryCarousel
        photos={photos}
        locale={locale}  // NEW
        t={{
          photoAlt: t.photoAlt,
          comingSoon: t.comingSoon,
          comingSoonNote: t.comingSoonNote,
          uploadButton: t.uploadButton,
          uploading: t.uploading,
          uploadSuccess: t.uploadSuccess,
          uploadError: t.uploadError,
          uploaderPrompt: t.uploaderPrompt,  // NEW
          uploaderPlaceholder: t.uploaderPlaceholder,  // NEW
          uploadedBy: t.uploadedBy,  // NEW
        }}
      />
    </section>
  );
}
```

**Update:** `app/page.tsx` (line 48)

```typescript
<PhotoGallery dict={dict} locale={locale} />
```

### 7. GalleryCarousel Upload Form
**Update:** `components/GalleryCarousel.tsx`

Replace passphrase UI with uploader name input:

```typescript
import { formatDate } from '@/lib/formatting';
import type { Locale } from '@/lib/i18n';
import type { PhotoMetadata } from '@/lib/drive';

type Photo = {
  src: string;
  fullSrc?: string;
  alt: string;
  metadata?: PhotoMetadata;  // NEW
};

type Strings = {
  photoAlt: string;
  comingSoon: string;
  comingSoonNote: string;
  uploadButton: string;
  uploading: string;
  uploadSuccess: string;
  uploadError: string;
  uploaderPrompt: string;      // NEW
  uploaderPlaceholder: string; // NEW
  uploadedBy: string;          // NEW
};

export default function GalleryCarousel({
  photos,
  locale,  // NEW
  t
}: {
  photos: Photo[];
  locale: Locale;  // NEW
  t: Strings;
}) {
  // Replace challenge/answer state with uploader name
  const [uploaderName, setUploaderName] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Remove: const [challenge, setChallenge] = useState<Challenge | null>(null);
  // Remove: const [answer, setAnswer] = useState('');

  // Replace handleUploadClick (lines 108-112)
  function handleUploadClick() {
    setNotice(null);
    setShowUploadForm(true);
  }

  // Replace handlePassphraseSubmit (lines 114-122)
  function handleUploaderSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploaderName.trim().length < 2) return;
    inputRef.current?.click();
  }

  // Update handleFileChange (lines 177-227)
  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setNotice(null);
    setUploading(true);
    try {
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('uploader_name', uploaderName.trim());  // NEW

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Upload failed with status ${res.status}`);
      }

      setShowUploadForm(false);  // NEW
      setUploaderName('');       // NEW
      setNotice('success');
      router.refresh();

      setTimeout(() => {
        setNotice(null);
      }, 5000);
    } catch (err) {
      console.error('Upload error:', err);
      setNotice('error');
    } finally {
      setUploading(false);
    }
  }

  // ... rest of component
}
```

**Update upload UI (replace lines 222-246):**

```typescript
<input
  ref={inputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="hidden"
/>

{showUploadForm && !uploading ? (
  <form
    onSubmit={handleUploaderSubmit}
    className="inline-flex flex-col sm:flex-row items-center gap-3"
  >
    <label htmlFor="uploader-name" className="text-sm text-blue-950">
      {t.uploaderPrompt}
    </label>
    <input
      id="uploader-name"
      type="text"
      value={uploaderName}
      onChange={(e) => setUploaderName(e.target.value)}
      placeholder={t.uploaderPlaceholder}
      autoFocus
      required
      minLength={2}
      className="w-40 px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white text-gray-900 text-sm text-center"
    />
    <button
      type="submit"
      className="bg-blue-950 hover:bg-blue-900 text-blue-50 text-sm font-medium px-5 py-2 rounded-lg shadow transition-colors"
    >
      Continue
    </button>
  </form>
) : (
  <button
    type="button"
    disabled={uploading}
    onClick={handleUploadClick}
    className="inline-flex items-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:bg-blue-900 text-blue-50 text-sm font-medium px-6 py-3 rounded-lg shadow transition-colors"
  >
    {uploading ? (
      <>
        {t.uploading}
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 border-2 border-blue-300/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-blue-50 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    ) : (
      <>
        {t.uploadButton}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
        </svg>
      </>
    )}
  </button>
)}
```

**Remove wrong-captcha notice (lines 278-280):**
```typescript
// DELETE THIS:
// {notice === 'wrong-captcha' && (
//   <p className="text-sm text-red-700 mt-3">Wrong passphrase. Please try again.</p>
// )}
```

### 8. Lightbox Metadata Display
**Update:** Lightbox image section (lines 325-336)

Add metadata overlay above photo counter:

```typescript
{/* Image container */}
<div onClick={(e) => e.stopPropagation()} className="relative">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={photos[lightboxIndex].fullSrc ?? photos[lightboxIndex].src}
    alt={photos[lightboxIndex].alt}
    className="max-w-full max-h-full object-contain"
  />

  {/* Photo counter */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
    {lightboxIndex + 1} / {photos.length}
  </div>

  {/* NEW: Metadata overlay */}
  {photos[lightboxIndex].metadata && (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white text-xs bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
      <div className="text-center">
        {t.uploadedBy} <span className="font-medium">{photos[lightboxIndex].metadata.uploader_name}</span>
      </div>
      <div className="text-center text-white/80 mt-1">
        {formatDate(photos[lightboxIndex].metadata.created_at, locale)}
      </div>
    </div>
  )}
</div>
```

## Testing Plan

1. **Upload new photo:**
   - Click "Add a Photo"
   - Enter name "Ben"
   - Select photo
   - Verify upload success message
   - Refresh page → photo appears

2. **Validation:**
   - Try empty name → required attribute blocks submit
   - Try single character → server returns 400 error
   - Normal name → success

3. **Lightbox metadata:**
   - Click newly uploaded photo
   - Verify shows "Uploaded by Ben"
   - Verify timestamp with timezone label
   - Switch to Indonesian → verify WIB instead of PST

4. **Legacy photos:**
   - Existing photos display normally
   - No metadata overlay shown
   - No console errors

5. **Timezone formatting:**
   - English locale → PST time + 🇺🇸
   - Indonesian locale → WIB time + 🇮🇩
   - Compare to guestbook timestamps (should match format)

## Critical Files

- `lib/database-setup.sql` - Add uploaded_photos schema
- `lib/formatting.ts` - Create shared formatDate utility
- `lib/drive.ts` - Add metadata fetching and types
- `app/api/upload/route.ts` - Replace passphrase with uploader_name, insert DB
- `components/PhotoGallery.tsx` - Pass locale and metadata to carousel
- `components/GalleryCarousel.tsx` - Upload form UI and lightbox display
- `components/GuestbookMessages.tsx` - Import shared formatDate
- `messages/en.json` + `messages/id.json` - Add translation keys
- `app/page.tsx` - Pass locale to PhotoGallery

## Migration Notes

- **No data migration needed** - LEFT JOIN handles legacy photos gracefully
- **Run schema in Neon console first** before deploying code changes
- **Existing photos** show normally without metadata overlay
- **New uploads** automatically get metadata stored
