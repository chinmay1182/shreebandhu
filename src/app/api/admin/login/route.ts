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

        // Compare password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password);

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
            phone: '',
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
