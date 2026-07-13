-- Neon Database Setup for Matheus Basuni Memorial Site
-- Run this SQL in your Neon database console

-- Create guestbook_entries table
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name TEXT NOT NULL,
  visitor_email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for performance (ordered by newest first)
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at DESC);

-- Create uploaded_photos table (metadata for gallery photo uploads).
-- Drive stores the image; this table records who uploaded it and when.
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

-- Verify table creation
SELECT 'Guestbook + uploaded_photos tables created successfully!' AS status;
