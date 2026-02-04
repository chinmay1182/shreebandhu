import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { handleFileUpload } from '@/app/lib/fileUpload';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = 'SELECT * FROM products';
    const params = [];

    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(name LIKE ? OR mainTitle LIKE ? OR subTitle LIKE ?)');
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await pool.query(query, params);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check product count limit (max 15 products)
    const [countResult] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM products');
    const productCount = countResult[0].count;

    if (productCount >= 15) {
      return NextResponse.json(
        { error: 'Product limit reached. Maximum 15 products allowed.' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const mainTitle = formData.get('mainTitle') as string;
    const subTitle = formData.get('subTitle') as string;
    const price = formData.get('price');
    const mrp = formData.get('mrp');
    const weight = formData.get('weight') as string;
    const category = formData.get('category') as string;
    const rating = formData.get('rating') || 0;
    const reviews = formData.get('reviews') || 0;
    const isActive = true; // Default to true
    const image = formData.get('image') as File;

    let image_url = '';
    if (image) {
      image_url = await handleFileUpload(image, 'products');
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, mainTitle, subTitle, price, mrp, weight, category, image_url, rating, reviews, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, mainTitle, subTitle, price, mrp, weight, category, image_url, rating, reviews, isActive]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}