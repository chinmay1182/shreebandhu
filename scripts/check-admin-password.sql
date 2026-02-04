-- Quick Fix: Check Current Admin Password
-- Run this query first to see what's in the database

SELECT id, username, password, 
       CASE 
           WHEN password LIKE '$2%' THEN 'Bcrypt Hash (Secure)'
           ELSE 'Plain Text (Needs Update)'
       END as password_type
FROM admins 
WHERE username = 'admin';

-- If the password is plain text, run this UPDATE:
-- Replace 'YOUR_CURRENT_PLAIN_PASSWORD' with the actual password you see in the database

-- UPDATE admins 
-- SET password = '$2b$10$xrhY4NCEiYW3zi0U92xJR.CmEl76H4ZkLd3dlFdPCImJiSoznCJMS' 
-- WHERE username = 'admin';
