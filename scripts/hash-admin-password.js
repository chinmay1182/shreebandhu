/**
 * Admin Password Migration Script
 * 
 * This script helps you generate bcrypt hashed passwords for admin accounts.
 * Run this script to get the hashed password, then manually update your database.
 * 
 * Usage:
 * 1. Install dependencies: npm install bcryptjs
 * 2. Run: node scripts/hash-admin-password.js
 * 3. Copy the generated hash
 * 4. Update database: UPDATE admins SET password = '<hash>' WHERE username = 'admin';
 */

const bcrypt = require('bcryptjs');

async function hashPassword(plainPassword) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        console.log('\n==============================================');
        console.log('Admin Password Hash Generator');
        console.log('==============================================\n');
        console.log('Plain Password:', plainPassword);
        console.log('\nBcrypt Hash:');
        console.log(hashedPassword);
        console.log('\n==============================================');
        console.log('SQL Update Command:');
        console.log('==============================================\n');
        console.log(`UPDATE admins SET password = '${hashedPassword}' WHERE username = 'admin';`);
        console.log('\n==============================================\n');

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

// Default admin password - CHANGE THIS to your actual admin password
const ADMIN_PASSWORD = 'admin123';

// Generate hash
hashPassword(ADMIN_PASSWORD);
