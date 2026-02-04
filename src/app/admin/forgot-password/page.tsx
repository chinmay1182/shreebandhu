'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminForgotPassword() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !authPassword || !email) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/admin/forgot-password', {
                username,
                authPassword,
                email
            });

            if (response.data.success) {
                setSuccess(response.data.message);
                setUsername('');
                setAuthPassword('');
                setEmail('');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                padding: '40px',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#1f2937',
                        marginBottom: '10px'
                    }}>
                        🔑 Admin Password Reset
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        Enter your details to receive a password reset link
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        background: '#d1fae5',
                        border: '1px solid #6ee7b7',
                        color: '#059669',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Admin Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter admin username"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Authentication Password
                        </label>
                        <input
                            type="password"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Enter authentication password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <p style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            marginTop: '6px'
                        }}>
                            🔒 Required for security verification
                        </p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontWeight: '500',
                            fontSize: '14px'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '16px',
                                transition: 'border-color 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? '#9ca3af' : 'linear-gradient(to right, #667eea, #764ba2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            fontSize: '14px',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        ← Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
