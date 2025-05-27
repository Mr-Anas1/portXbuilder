-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Update existing users to have a clerk_id (if needed)
-- This is just a placeholder, you'll need to handle existing users differently
-- UPDATE users SET clerk_id = id WHERE clerk_id IS NULL; 