'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/app/context/AuthContext';
import styles from '@/app/admin/styles/admin.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 0,
        revenue: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Optional: Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹ ${(amount / 100000).toFixed(1)}L`;
        }
        return `₹ ${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <div>
                    <button className={styles.button}>Export Report</button>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard}>
                        {loading ? (
                            <div className={styles.statsValue}>...</div>
                        ) : (
                            <div className={styles.statsValue}>{stats.totalOrders}</div>
                        )}
                        <div className={styles.statsLabel}>Total Orders</div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                        {loading ? (
                            <div className={styles.statsValue}>...</div>
                        ) : (
                            <div className={styles.statsValue}>{formatCurrency(stats.revenue)}</div>
                        )}
                        <div className={styles.statsLabel}>Revenue This Month</div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className={styles.statsCard} style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                        {loading ? (
                            <div className={styles.statsValue}>...</div>
                        ) : (
                            <div className={styles.statsValue}>{stats.pendingOrders}</div>
                        )}
                        <div className={styles.statsLabel}>Pending Orders</div>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>Recent Activity</div>
                <div className={styles.cardBody}>
                    <p>Welcome back, <strong>{user?.name || 'Admin'}</strong>.</p>
                    <p className="text-muted">Here's what's happening with your store today.</p>
                </div>
            </div>
        </div>
    );
}
