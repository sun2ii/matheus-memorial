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

-- Verify table creation
SELECT 'Guestbook table created successfully!' AS status;
