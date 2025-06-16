-- Check if columns exist and add them if they don't
DO $$ 
BEGIN
    -- Add razorpay_customer_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'razorpay_customer_id'
    ) THEN
        ALTER TABLE users ADD COLUMN razorpay_customer_id TEXT;
    END IF;

    -- Add subscription_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_id'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_id TEXT;
    END IF;

    -- Add subscription_status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_status'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_status TEXT;
    END IF;

    -- Add subscription_start_date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_start_date'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_start_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add subscription_end_date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'subscription_end_date'
    ) THEN
        ALTER TABLE users ADD COLUMN subscription_end_date TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add plan column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'plan'
    ) THEN
        ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free';
    END IF;

    -- Add index on razorpay_customer_id for faster lookups
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname = 'users_razorpay_customer_id_idx'
    ) THEN
        CREATE INDEX users_razorpay_customer_id_idx ON users(razorpay_customer_id);
    END IF;

    -- Add index on subscription_id for faster lookups
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname = 'users_subscription_id_idx'
    ) THEN
        CREATE INDEX users_subscription_id_idx ON users(subscription_id);
    END IF;

END $$; 