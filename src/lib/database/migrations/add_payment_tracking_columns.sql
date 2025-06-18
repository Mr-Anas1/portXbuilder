-- Add payment tracking columns if they don't exist
DO $$ 
BEGIN
    -- Add last_payment_attempt column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'last_payment_attempt'
    ) THEN
        ALTER TABLE users ADD COLUMN last_payment_attempt TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Add payment_failure_count column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'payment_failure_count'
    ) THEN
        ALTER TABLE users ADD COLUMN payment_failure_count INTEGER DEFAULT 0;
    END IF;

    -- Add grace_period_end column
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'grace_period_end'
    ) THEN
        ALTER TABLE users ADD COLUMN grace_period_end TIMESTAMP WITH TIME ZONE;
    END IF;
END $$; 