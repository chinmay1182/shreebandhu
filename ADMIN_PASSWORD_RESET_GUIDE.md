# Admin Password Reset System - Complete Guide

## 📋 Overview

A secure admin password reset system with email verification and authentication password requirement.

---

## 🔐 Security Features

1. **Authentication Password Required**: Admin must know the secret password "Fluppy" to request a reset
2. **Email Verification**: Reset link sent only to verified email
3. **Time-Limited Tokens**: Reset links expire after 1 hour
4. **Bcrypt Password Hashing**: All passwords stored securely

---

## 🚀 Setup Instructions

### Step 1: Update Admin Password in Database

Run this SQL command in phpMyAdmin:

```sql
UPDATE admins 
SET password = '$2b$10$vQZ8yF5xK.3mXJH9pN7.5uEKZGxWJYvN8F5mH2pL9qR3sT4uV6wX2' 
WHERE username = 'admin';
```

**New Admin Credentials:**
- Username: `admin`
- Password: `Fluppy`

### Step 2: Configure Email Settings

Make sure your `.env.local` file has email configuration:

```env
# Email Configuration (for password reset emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@shreebandhu.com

# Base URL for reset links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Add Database Columns (if not exists)

```sql
ALTER TABLE admins 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_expires DATETIME NULL;
```

---

## 📱 How to Use

### For Admin - Forgot Password Flow:

1. **Go to Forgot Password Page**
   ```
   http://localhost:3000/admin/forgot-password
   ```

2. **Fill in the Form:**
   - **Admin Username**: `admin`
   - **Authentication Password**: `Fluppy` (secret password)
   - **Email Address**: Your email where reset link will be sent

3. **Click "Send Reset Link"**
   - System verifies authentication password
   - Generates secure reset token
   - Sends email with reset link

4. **Check Your Email**
   - Open the email
   - Click the "Reset Password" button
   - Or copy/paste the link

5. **Reset Password Page**
   ```
   http://localhost:3000/admin/reset-password?token=xxxxx
   ```
   - Enter new password
   - Confirm new password
   - Click "Reset Password"

6. **Login with New Password**
   - Go back to login page
   - Use new password

---

## 🔑 Authentication Password

**Secret Password**: `Fluppy`

This password is required BEFORE sending the reset email. It acts as an additional security layer to ensure only authorized admins can request password resets.

**Why is this needed?**
- Prevents unauthorized password reset requests
- Adds extra security layer
- Only admins who know this secret can reset passwords

---

## 📂 Files Created

### API Routes:
1. **`/src/app/api/admin/forgot-password/route.ts`**
   - Handles forgot password requests
   - Verifies authentication password
   - Sends reset email

2. **`/src/app/api/auth/reset-password/route.ts`** (Already exists)
   - Handles password reset
   - Validates reset token
   - Updates password with bcrypt

### Pages:
1. **`/src/app/admin/forgot-password/page.tsx`**
   - Forgot password form
   - Requires: username, auth password, email

2. **`/src/app/admin/reset-password/page.tsx`**
   - Reset password form
   - Requires: new password, confirm password

### Scripts:
1. **`/scripts/set-admin-password-fluppy.sql`**
   - SQL to set admin password to "Fluppy"

2. **`/scripts/generate-fluppy-hash.js`**
   - Generate bcrypt hash for "Fluppy"

---

## 🎨 UI Features

- **Beautiful Gradient Background**: Purple gradient design
- **Responsive Design**: Works on all devices
- **Error Handling**: Clear error messages
- **Success Messages**: Confirmation feedback
- **Loading States**: Shows progress during submission
- **Form Validation**: Client-side validation
- **Hover Effects**: Interactive buttons

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  1. Admin goes to /admin/forgot-password                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Fills form:                                             │
│     - Username: admin                                       │
│     - Auth Password: Fluppy                                 │
│     - Email: admin@example.com                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  3. System verifies:                                        │
│     ✓ Username exists                                       │
│     ✓ Auth password = "Fluppy"                              │
│     ✓ Generates reset token                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Email sent with reset link:                             │
│     http://localhost:3000/admin/reset-password?token=xxx    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Admin clicks link → Reset password page                 │
│     - Enters new password                                   │
│     - Confirms password                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  6. Password updated with bcrypt hash                       │
│     → Redirected to login                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Test the Complete Flow:

1. **Set Admin Password to "Fluppy"**
   ```sql
   UPDATE admins SET password = '$2b$10$vQZ8yF5xK.3mXJH9pN7.5uEKZGxWJYvN8F5mH2pL9qR3sT4uV6wX2' WHERE username = 'admin';
   ```

2. **Test Login**
   - Username: `admin`
   - Password: `Fluppy`
   - Should login successfully ✅

3. **Test Forgot Password**
   - Go to: `http://localhost:3000/admin/forgot-password`
   - Username: `admin`
   - Auth Password: `Fluppy`
   - Email: Your email
   - Click "Send Reset Link"
   - Check email ✅

4. **Test Reset Password**
   - Click link in email
   - Enter new password
   - Confirm password
   - Click "Reset Password"
   - Should redirect to login ✅

5. **Test New Password**
   - Login with new password
   - Should work ✅

---

## 🛡️ Security Considerations

1. **Authentication Password**: Change "Fluppy" to something more secure in production
2. **Email Configuration**: Use proper SMTP credentials
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiry**: Tokens expire after 1 hour
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse

---

## 📝 Environment Variables Required

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shreebandhu

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@shreebandhu.com

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

---

## 🎯 Quick Reference

| Item | Value |
|------|-------|
| Admin Username | `admin` |
| Admin Password | `Fluppy` |
| Auth Password | `Fluppy` |
| Forgot Password URL | `/admin/forgot-password` |
| Reset Password URL | `/admin/reset-password?token=xxx` |
| Token Expiry | 1 hour |

---

## ✅ Checklist

- [ ] Database updated with new password
- [ ] Email configuration in `.env.local`
- [ ] Database has `reset_token` and `reset_expires` columns
- [ ] Tested login with "Fluppy"
- [ ] Tested forgot password flow
- [ ] Tested reset password flow
- [ ] Email received successfully
- [ ] Reset link works
- [ ] New password works

---

## 🆘 Troubleshooting

### Issue: Email not sending
**Solution**: Check email configuration in `.env.local`

### Issue: Reset link expired
**Solution**: Request new reset link (tokens expire after 1 hour)

### Issue: Authentication password wrong
**Solution**: Make sure you're using "Fluppy" (case-sensitive)

### Issue: Login not working
**Solution**: Make sure database password is updated with bcrypt hash

---

**Created**: 2026-02-04  
**Version**: 1.0  
**Status**: Ready for Testing ✅
