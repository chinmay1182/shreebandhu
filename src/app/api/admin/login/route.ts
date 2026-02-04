import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { createSession, setSessionCookie } from '@/app/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Check credentials against admins table with bcrypt
        const admins = await queryDB(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        ) as any[];

        if (!admins || admins.length === 0) {
            return NextResponse.json(
                { error: 'Invalid admin credentials' },
                { status: 401 }
            );
        }

        const admin = admins[0];

        // Support both bcrypt and plain text passwords for backward compatibility
        let isPasswordValid = false;

        // Check if password is bcrypt hashed (starts with $2b$ or $2a$)
        if (admin.password.startsWith('$2b$') || admin.password.startsWith('$2a$')) {
            // Use bcrypt comparison for hashed passwords
            isPasswordValid = await bcrypt.compare(password, admin.password);
        } else {
            // Fallback to plain text comparison (for migration period)
            // TODO: Remove this after all passwords are migrated to bcrypt
            isPasswordValid = (password === admin.password);
        }

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid admin credentials' },
                { status: 401 }
            );
        }

        // Create admin session
        const token = await createSession({
            userId: admin.id.toString(),
            name: admin.username,
            email: '', // Admins might not have email in this simple schema
            mobile: '',
            role: 'admin'
        });

        await setSessionCookie(token);

        return NextResponse.json({
            success: true,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
