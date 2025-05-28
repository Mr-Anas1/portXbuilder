-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own data"
ON users
FOR UPDATE
TO authenticated
USING (
  clerk_id::text = auth.uid()::text
)
WITH CHECK (
  clerk_id::text = auth.uid()::text
);

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read their own data"
ON users
FOR SELECT
TO authenticated
USING (
  clerk_id::text = auth.uid()::text
);

-- Create policy to allow service role to manage all users
CREATE POLICY "Service role can manage all users"
ON users
TO service_role
USING (true)
WITH CHECK (true); 