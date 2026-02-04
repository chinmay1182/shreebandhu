-- Admin Password Update SQL Script
-- Generated on: 2026-02-04
-- 
-- IMPORTANT: Run this SQL command in your MySQL database to update admin password
-- This updates the admin password to use bcrypt hash instead of plain text
--
-- Original Password: admin123
-- Bcrypt Hash: $2b$10$xrhY4NCEiYW3zi0U92xJR.CmEl76H4ZkLd3dlFdPCImJiSoznCJMS

-- Step 1: Select your database (CHANGE 'your_database_name' to your actual database name)
-- USE your_database_name;

-- Step 2: Update admin password with bcrypt hash
UPDATE admins 
SET password = '$2b$10$xrhY4NCEiYW3zi0U92xJR.CmEl76H4ZkLd3dlFdPCImJiSoznCJMS' 
WHERE username = 'admin';

-- Step 3: Verify the update
SELECT id, username, 'password updated successfully' as status 
FROM admins 
WHERE username = 'admin';

-- NOTES:
-- 1. Before running, uncomment the USE statement and replace 'your_database_name' with your actual database name
-- 2. After running this, admin can login with password: admin123
-- 3. The password is now securely hashed with bcrypt
-- 4. Make sure to backup your database before running this update
-- 5. If you have multiple admin accounts, update them individually
