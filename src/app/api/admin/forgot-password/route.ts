import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { sendEmail } from '@/app/lib/email';
import { nanoid } from 'nanoid';

/**
 * Admin Password Reset - Request Reset Link
 * POST /api/admin/forgot-password
 * 
 * Requires admin authentication password before sending reset email
 */
export async function POST(request: Request) {
    try {
        const { username, authPassword, email } = await request.json();

        // Validate required fields
        if (!username || !authPassword || !email) {
            return NextResponse.json(
                { error: 'Username, authentication password, and email are required' },
                { status: 400 }
            );
        }

        // Step 1: Verify admin exists
        const admins = await queryDB(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        ) as any[];

        if (!admins || admins.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const admin = admins[0];

        // Step 2: Verify authentication password (hardcoded: "Fluppy")
        if (authPassword !== 'Fluppy') {
            return NextResponse.json(
                { error: 'Invalid authentication password' },
                { status: 401 }
            );
        }

        // Step 3: Generate reset token
        const resetToken = nanoid(32);
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
        const resetExpiresStr = resetExpires.toISOString().slice(0, 19).replace('T', ' ');

        // Step 4: Store reset token in database
        await queryDB(
            'UPDATE admins SET reset_token = ?, reset_expires = ? WHERE id = ?',
            [resetToken, resetExpiresStr, admin.id]
        );

        // Step 5: Send reset email
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shreebandhu.com'}/admin/reset-password?token=${resetToken}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Admin Password Reset Request</h2>
                <p>Hello <strong>${admin.username}</strong>,</p>
                <p>You have requested to reset your admin password. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" 
                       style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">
                    ${resetLink}
                </p>
                <p style="color: #6b7280; font-size: 14px;">
                    This link will expire in 1 hour.<br>
                    If you didn't request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                    Shree Bandhu Admin Panel
                </p>
            </div>
        `;

        await sendEmail(email, 'Admin Password Reset Request', emailHtml);

        return NextResponse.json({
            success: true,
            message: 'Password reset link has been sent to your email'
        });

    } catch (error: any) {
        console.error('Admin forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process password reset request' },
            { status: 500 }
        );
    }
}
