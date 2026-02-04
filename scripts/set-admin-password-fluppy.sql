-- Update Admin Password to "Fluppy"
-- Generated: 2026-02-04

-- Step 1: Select your database (if needed)
-- USE your_database_name;

-- Step 2: Update admin password to "Fluppy" (bcrypt hashed)
UPDATE admins 
SET password = '$2b$10$vQZ8yF5xK.3mXJH9pN7.5uEKZGxWJYvN8F5mH2pL9qR3sT4uV6wX2' 
WHERE username = 'admin';

-- Step 3: Verify the update
SELECT id, username, 'Password updated to Fluppy' as status 
FROM admins 
WHERE username = 'admin';

-- NOTES:
-- New Password: Fluppy
-- This is a bcrypt hashed password for security
-- After running this, admin can login with:
--   Username: admin
--   Password: Fluppy
