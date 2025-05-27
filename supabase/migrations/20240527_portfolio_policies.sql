-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can read their own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Service role can manage all portfolios" ON portfolios;

-- Enable RLS on portfolios table
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own portfolios
CREATE POLICY "Users can insert their own portfolios"
ON portfolios
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IN (
    SELECT id FROM users WHERE clerk_id::text = auth.uid()::text
  )
);

-- Create policy to allow users to update their own portfolios
CREATE POLICY "Users can update their own portfolios"
ON portfolios
FOR UPDATE
TO authenticated
USING (
  user_id IN (
    SELECT id FROM users WHERE clerk_id::text = auth.uid()::text
  )
)
WITH CHECK (
  user_id IN (
    SELECT id FROM users WHERE clerk_id::text = auth.uid()::text
  )
);

-- Create policy to allow users to read their own portfolios
CREATE POLICY "Users can read their own portfolios"
ON portfolios
FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT id FROM users WHERE clerk_id::text = auth.uid()::text
  )
);

-- Create policy to allow service role to manage all portfolios
CREATE POLICY "Service role can manage all portfolios"
ON portfolios
TO service_role
USING (true)
WITH CHECK (true); 