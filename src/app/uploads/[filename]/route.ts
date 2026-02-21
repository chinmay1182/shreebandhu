import { NextRequest, NextResponse } from 'next/server';
import { serveStaticFile } from '@/app/lib/serveStaticFile';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    return serveStaticFile('uploads', filename);
  } catch (error) {
    console.error('Error serving upload file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
