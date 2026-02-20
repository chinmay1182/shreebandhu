import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { handleFileUpload, deleteFile } from '@/app/lib/fileUpload';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await queryDB('SELECT * FROM banners ORDER BY display_order ASC, created_at DESC');
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const link = formData.get('link')?.toString() || '';
    const title = formData.get('title')?.toString() || '';
    const display_order = formData.get('display_order')?.toString() || '0';

    if (!image || image.size === 0) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const image_url = await handleFileUpload(image, 'banners');

    await queryDB(
      'INSERT INTO banners (image_url, link, title, display_order) VALUES (?, ?, ?, ?)',
      [image_url, link, title, parseInt(display_order)]
    );

    return NextResponse.json({ success: true, message: 'Banner added successfully' });
  } catch (error) {
    console.error('Error adding banner:', error);
    return NextResponse.json({ error: 'Failed to add banner' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    // Get file path to delete image
    const banners = await queryDB('SELECT image_url FROM banners WHERE id = ?', [id]) as any[];
    if (banners.length > 0) {
      await deleteFile(banners[0].image_url);
    }

    await queryDB('DELETE FROM banners WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
