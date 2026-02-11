'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import styles from '@/app/admin/styles/admin.module.css';

interface User {
    id: number;
    name: string;
    email: string;
    mobile: string;
    created_at: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setDeletingId(id);
        try {
            await axios.delete(`/api/users?id=${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>User Management</h1>
                    <p className={styles.pageSubtitle}>View and manage registered users</p>
                </div>
                <div className={styles.statsCard} style={{ minWidth: '200px', padding: '15px' }}>
                    <div className="d-flex align-items-center">
                        <div className={styles.statsIcon} style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5' }}>
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="ms-3">
                            <h3 className="m-0 fw-bold">{users.length}</h3>
                            <p className="m-0 text-muted small">Total Users</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className="row g-0">
                        <div className="col-1 text-center">#</div>
                        <div className="col-3">Name</div>
                        <div className="col-3">Email</div>
                        <div className="col-2">Mobile</div>
                        <div className="col-2">Joined</div>
                        <div className="col-1 text-center">Actions</div>
                    </div>
                </div>

                <div className={styles.tableBody}>
                    {users.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-people display-4 mb-3 d-block"></i>
                            No users found
                        </div>
                    ) : (
                        users.map((user, index) => (
                            <div key={user.id} className={styles.tableRow}>
                                <div className="row g-0 align-items-center">
                                    <div className="col-1 text-center text-muted">{index + 1}</div>
                                    <div className="col-3 fw-medium text-truncate d-block" title={user.name}>{user.name}</div>
                                    <div className="col-3 text-muted text-truncate d-block" title={user.email}>{user.email}</div>
                                    <div className="col-2 text-truncate d-block" title={user.mobile}>{user.mobile}</div>
                                    <div className="col-2 text-muted small">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="col-1 text-center">
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deletingId === user.id}
                                            title="Delete User"
                                        >
                                            {deletingId === user.id ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <i className="bi bi-trash"></i>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
