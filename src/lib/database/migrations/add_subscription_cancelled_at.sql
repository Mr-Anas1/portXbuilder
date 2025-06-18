-- Add subscription_cancelled_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_cancelled_at'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_cancelled_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$; 