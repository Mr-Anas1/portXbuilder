-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Public can read user data" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON users;
DROP POLICY IF EXISTS "Allow all for everyone" ON users;

-- Create a single policy that allows all operations for everyone
CREATE POLICY "Allow all for everyone"
ON users
FOR ALL
TO public, authenticated, anon
USING (true)
WITH CHECK (true); 