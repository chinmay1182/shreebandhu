import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export function serveStaticFile(
  subdir: string,
  filename: string
): NextResponse {
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  const targetDir = path.resolve(publicDir, subdir);
  const filePath = path.resolve(targetDir, filename);

  if (!filePath.startsWith(targetDir)) {
    return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Static file not found: ${filePath} (${subdir}/${filename})`);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': stats.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
