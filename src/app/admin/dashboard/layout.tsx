'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/app/components/admin/AdminSidebar';
import styles from '@/app/admin/styles/admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [layoutLoading, setLayoutLoading] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                router.push('/');
            } else {
                setLayoutLoading(false);
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || layoutLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#F3F4F6' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <AdminSidebar />
            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}
