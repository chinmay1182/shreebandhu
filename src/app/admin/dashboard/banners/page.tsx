'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/app/lib/apiClient';
import Image from 'next/image';
import styles from '@/app/admin/styles/admin.module.css';

interface Banner {
    id: number;
    image_url: string;
    title: string;
    link: string;
    display_order: number;
}

export default function AdminBanners() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchBanners = async () => {
        try {
            const data = await apiClient<Banner[]>('/banners');
            setBanners(data);
        } catch (error) {
            console.error('Failed to fetch banners');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            alert('Please select an image');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('title', title);
        formData.append('link', link);
        formData.append('display_order', displayOrder);

        try {
            const res = await fetch('/api/banners', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setTitle('');
                setLink('');
                setDisplayOrder('0');
                setImage(null);
                fetchBanners();
                alert('Banner added successfully');
            } else {
                alert('Failed to add banner');
            }
        } catch (error) {
            alert('Error uploading banner');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            const res = await fetch(`/api/banners?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchBanners();
            } else {
                alert('Failed to delete banner');
            }
        } catch (error) {
            alert('Error deleting banner');
        }
    };

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Banners</h1>
            </div>

            <div className="row">
                {/* Form */}
                <div className="col-lg-4 mb-4">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Add New Banner</div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Title (Optional)</label>
                                    <input type="text" className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Promo Title" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Link (Optional)</label>
                                    <input type="text" className={styles.input} value={link} onChange={(e) => setLink(e.target.value)} placeholder="/products/..." />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Display Order</label>
                                    <input type="number" className={styles.input} value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small">Banner Image</label>
                                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required />
                                </div>
                                <button type="submit" className={styles.button} disabled={uploading}>
                                    {uploading ? 'Uploading...' : 'Add Banner'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="col-lg-8">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Active Banners (Sorted by Order)</div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>
                                <div className="row">
                                    <div className="col-3">Preview</div>
                                    <div className="col-4">Details</div>
                                    <div className="col-2">Order</div>
                                    <div className="col-3 text-end">Action</div>
                                </div>
                            </div>
                            {isLoading ? <div className="p-4 text-center">Loading...</div> : banners.map((banner) => (
                                <div key={banner.id} className={styles.tableRow}>
                                    <div className="row w-100 align-items-center m-0">
                                        <div className="col-3">
                                            <div style={{ width: '100px', height: '50px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                                <Image
                                                    src={banner.image_url}
                                                    alt="Banner"
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    unoptimized
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/Banner.jpg'; // Fallback
                                                        target.onerror = null; // Prevent loop
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="fw-bold text-dark">{banner.title || 'No Title'}</div>
                                            <div className="small text-muted text-truncate">{banner.link}</div>
                                        </div>
                                        <div className="col-2">
                                            <span className="badge bg-light text-dark">{banner.display_order}</span>
                                        </div>
                                        <div className="col-3 text-end">
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && !isLoading && (
                                <div className="p-4 text-center text-muted">No banners found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
