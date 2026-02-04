
import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import path from 'path';
import fs from 'fs';
import https from 'https';

export const dynamic = 'force-dynamic'; // Ensure dynamic route behavior

export const runtime = 'nodejs';

export async function GET() {
  try {
    const combos = await queryDB(`
      SELECT 
        co.id, co.name, co.mainTitle, co.subTitle,
        CAST(co.price AS DECIMAL(10,2)) as price,
        CAST(co.mrp AS DECIMAL(10,2)) as mrp,
        co.discount, co.image_url, co.product1Id, co.product2Id,
        co.isActive, CAST(co.rating AS DECIMAL(3,1)) as rating,
        co.reviews, co.weight, co.category,
        p1.name as product1_name, CAST(p1.price AS DECIMAL(10,2)) as product1_price,
        p1.image_url as product1_image,
        p2.name as product2_name, CAST(p2.price AS DECIMAL(10,2)) as product2_price,
        p2.image_url as product2_image
      FROM combo_orders co
      LEFT JOIN products p1 ON co.product1Id = p1.id
      LEFT JOIN products p2 ON co.product2Id = p2.id
      WHERE co.isActive = true
      ORDER BY co.createdAt DESC
    `);
    const response = NextResponse.json(combos);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error: any) {
    // Fallback: fetch from admin API on server, bypassing invalid cert
    try {
      const adminUrl = new URL('/api/combo-orders', 'https://adminpanel.shreebandhu.com');
      const data = await new Promise<any>((resolve, reject) => {
        const req = https.request({
          method: 'GET',
          hostname: adminUrl.hostname,
          path: adminUrl.pathname + adminUrl.search,
          agent: new https.Agent({ rejectUnauthorized: false }),
          headers: { Accept: 'application/json' },
        }, (res) => {
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
          });
        });
        req.on('error', reject);
        req.end();
      });

      const response = NextResponse.json(data);
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    } catch (fallbackErr: any) {
      console.error('API route error (db + fallback):', fallbackErr);
      const response = NextResponse.json(
        {
          error: 'Failed to fetch combo orders',
          details: process.env.NODE_ENV === 'development' ? (fallbackErr.message || error.message) : null
        },
        { status: 500 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }
  }
}

export async function POST(request: Request) {
  try {
    // Check combo count limit (max 15 combos)
    const countResult = await queryDB('SELECT COUNT(*) as count FROM combo_orders') as any[];
    const comboCount = countResult[0].count;

    if (comboCount >= 15) {
      const response = NextResponse.json(
        { error: 'Combo limit reached. Maximum 15 combos allowed.' },
        { status: 400 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const formData = await request.formData();

    // Extract form data
    const name = formData.get('name')?.toString();
    const mainTitle = formData.get('mainTitle')?.toString() || '';
    const subTitle = formData.get('subTitle')?.toString() || '';
    const price = formData.get('price')?.toString();
    const mrp = formData.get('mrp')?.toString();
    const product1Id = formData.get('product1Id')?.toString();
    const product2Id = formData.get('product2Id')?.toString();
    const isActive = formData.get('isActive') === 'true';
    const rating = formData.get('rating')?.toString() || '0';
    const reviews = formData.get('reviews')?.toString() || '0';
    const weight = formData.get('weight')?.toString() || '0g';
    const category = formData.get('category')?.toString() || 'combo';
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!name || !price || !product1Id || !product2Id) {
      throw new Error('Missing required fields');
    }

    // Process image upload if exists
    let imagePath = null;
    if (imageFile) {
      imagePath = await handleFileUpload(imageFile);
    }

    // Calculate discount
    const numericPrice = parseFloat(price);
    const numericMrp = mrp ? parseFloat(mrp) : numericPrice;
    const discount = Math.round(((numericMrp - numericPrice) / numericMrp) * 100);

    // Insert into database
    const result = await queryDB(
      `INSERT INTO combo_orders 
       (name, mainTitle, subTitle, price, mrp, discount, image_url, 
        product1Id, product2Id, isActive, rating, reviews, weight, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        mainTitle,
        subTitle,
        numericPrice,
        numericMrp,
        discount,
        imagePath,
        parseInt(product1Id),
        parseInt(product2Id),
        isActive,
        parseFloat(rating),
        parseInt(reviews),
        weight,
        category
      ]
    ) as any;

    const response = NextResponse.json({
      success: true,
      id: result.insertId
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error: any) {
    console.error('API POST error:', error);
    const response = NextResponse.json(
      {
        error: 'Failed to create combo',
        details: process.env.NODE_ENV === 'development' ? error.message : null
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// File upload helper function
async function handleFileUpload(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const timestamp = Date.now();
  const ext = file.name.split('.').pop();
  const filename = `combo-${timestamp}.${ext}`;
  const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

  await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
  await fs.promises.writeFile(uploadPath, buffer);

  return `/uploads/${filename}`;
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Combo ID is required' }, { status: 400 });
    }

    await queryDB('DELETE FROM combo_orders WHERE id = ?', [id]);

    const response = NextResponse.json({ success: true });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error: any) {
    console.error('Error deleting combo:', error);
    return NextResponse.json(
      { error: 'Failed to delete combo', details: error.message },
      { status: 500 }
    );
  }
}