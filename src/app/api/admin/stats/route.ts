
import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Total Orders
        const totalOrdersResult = await queryDB('SELECT COUNT(*) as count FROM orders');
        const totalOrders = (totalOrdersResult as any[])[0]?.count || 0;

        // 2. Revenue This Month
        // Get the first day of the current month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const formattedDate = firstDayOfMonth.toISOString().slice(0, 19).replace('T', ' ');

        const revenueResult = await queryDB(
            `SELECT SUM(total_amount) as revenue 
       FROM orders 
       WHERE created_at >= ? AND status != 'cancelled'`,
            [formattedDate]
        );
        const revenue = (revenueResult as any[])[0]?.revenue || 0;

        // 3. Pending Orders
        const pendingOrdersResult = await queryDB(
            "SELECT COUNT(*) as count FROM orders WHERE status = 'pending'"
        );
        const pendingOrders = (pendingOrdersResult as any[])[0]?.count || 0;

        return NextResponse.json({
            totalOrders,
            revenue,
            pendingOrders
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
