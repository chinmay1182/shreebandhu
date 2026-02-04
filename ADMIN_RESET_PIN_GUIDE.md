# Admin Password Reset with PIN - Implementation Guide

## 📋 Overview

Adding admin password reset functionality to the navbar modal with PIN protection (852963).

---

## 🔐 Features

1. **PIN Protection**: User must enter PIN "852963" to access reset form
2. **Email-Based Reset**: Admin enters email to receive reset link
3. **Beautiful Modal**: Same gradient design as login/signup
4. **Secure Process**: Uses existing `/api/admin/forgot-password` endpoint

---

## 🎯 User Flow

```
1. User clicks "Admin Login" in modal
2. User clicks "Forgot Password?"
3. Modal shows PIN input
4. User enters PIN: 852963
5. If correct → Shows email input form
6. User enters email
7. System sends reset link to email
8. Success message shown
9. Modal closes after 3 seconds
```

---

## 📝 Required Changes

### 1. State Variables (Add to Navbar.tsx)
```typescript
const [isAdminResetMode, setIsAdminResetMode] = useState(false);
const [showPinInput, setShowPinInput] = useState(false);
const [pin, setPin] = useState('');
const [resetEmail, setResetEmail] = useState('');
const [success, setSuccess] = useState('');
```

### 2. Handler Functions

#### PIN Verification
```typescript
const handlePinSubmit = () => {
  if (pin === '852963') {
    setShowPinInput(false);
    setIsAdminResetMode(true);
    setError('');
    setPin('');
  } else {
    setError('Invalid PIN. Please try again.');
    setPin('');
  }
};
```

#### Password Reset Request
```typescript
const handleAdminPasswordReset = async () => {
  if (!resetEmail) {
    setError('Email is required');
    return;
  }

  setIsAuthLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await axios.post('/api/admin/forgot-password', {
      username: 'admin',
      authPassword: 'Fluppy',
      email: resetEmail
    });

    if (response.data.success) {
      setSuccess('Password reset link has been sent to your email!');
      setResetEmail('');
      setTimeout(() => {
        setIsProfileModalOpen(false);
        setIsAdminResetMode(false);
        setSuccess('');
      }, 3000);
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'Failed to send reset email');
  } finally {
    setIsAuthLoading(false);
  }
};
```

### 3. Update handleAuthSubmit
```typescript
const handleAuthSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (isAdminResetMode) {
    handleAdminPasswordReset();
  } else if (isSignupMode) {
    handleSignup();
  } else {
    handleLogin();
  }
};
```

### 4. Modal UI Updates

#### Add "Forgot Password" Button (in Admin Login mode)
```typescript
{isAdminLoginMode && !isAdminResetMode && (
  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
    <button
      type="button"
      onClick={() => setShowPinInput(true)}
      style={{
        background: 'none',
        border: 'none',
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline'
      }}
    >
      Forgot Password?
    </button>
  </div>
)}
```

#### PIN Input Modal
```typescript
{showPinInput && (
  <div style={{
    background: '#f3f4f6',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  }}>
    <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Enter Security PIN</h3>
    <input
      type="password"
      placeholder="Enter 6-digit PIN"
      value={pin}
      onChange={(e) => setPin(e.target.value)}
      maxLength={6}
      className={styles.inputField}
      style={{ marginBottom: '12px' }}
    />
    <button
      onClick={handlePinSubmit}
      style={{
        width: '100%',
        padding: '10px',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
    >
      Verify PIN
    </button>
  </div>
)}
```

#### Reset Email Form
```typescript
{isAdminResetMode && !showPinInput && (
  <>
    <input
      type="email"
      placeholder="Enter your email address"
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
      className={styles.inputField}
      required
    />
  </>
)}
```

#### Success Message
```typescript
{success && (
  <div style={{
    background: '#d1fae5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  }}>
    ✅ {success}
  </div>
)}
```

---

## 🎨 Modal Title & Icon Updates

```typescript
<div style={{
  width: '70px',
  height: '70px',
  background: isAdminResetMode
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : isAdminLoginMode 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : isSignupMode
    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 20px',
  fontSize: '35px'
}}>
  {isAdminResetMode ? '🔑' : isAdminLoginMode ? '🔐' : isSignupMode ? '✨' : '👤'}
</div>

<h2 className={styles.modalTitle}>
  {isAdminResetMode ? 'Reset Admin Password' : isAdminLoginMode ? 'Admin Login' : isSignupMode ? 'Create Account' : 'Welcome Back'}
</h2>

<p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
  {isAdminResetMode ? 'Enter your email to receive reset link' : isAdminLoginMode ? 'Access the admin dashboard' : isSignupMode ? 'Join us and start shopping' : 'Login to your account'}
</p>
```

---

## 🔄 Complete Flow

1. **Admin clicks login** → Modal opens
2. **Clicks "Admin Login"** → Shows admin login form
3. **Clicks "Forgot Password?"** → Shows PIN input
4. **Enters PIN 852963** → Shows email form
5. **Enters email** → Sends reset link
6. **Success message** → Modal closes after 3s
7. **Check email** → Click reset link
8. **Reset password page** → Enter new password
9. **Done!** → Can login with new password

---

## ✅ Testing Steps

1. Open navbar modal
2. Click "Admin Login"
3. Click "Forgot Password?"
4. Enter wrong PIN → Should show error
5. Enter correct PIN (852963) → Should show email form
6. Enter email → Should send reset link
7. Check email → Should receive link
8. Click link → Should open reset page
9. Reset password → Should work

---

## 🎯 Security Features

- **PIN Protection**: 852963 required
- **Email Verification**: Link sent to registered email
- **Token Expiry**: 1 hour validity
- **Secure API**: Uses existing secure endpoint
- **No Direct Access**: Must know PIN to access

---

**Status**: Ready to Implement  
**Priority**: High  
**Complexity**: Medium  
**Time**: 15-20 minutes
