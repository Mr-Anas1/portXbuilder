-- Add plan column to users table
ALTER TABLE users ADD COLUMN plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro'));

-- Update existing users to have a plan
UPDATE users SET plan = 'free' WHERE plan IS NULL; 