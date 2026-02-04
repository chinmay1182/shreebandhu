'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from '@/app/admin/styles/admin.module.css';

interface Product {
    id: number;
    name: string;
    price: number;
    image_url: string;
}

interface Combo {
    id: number;
    name: string;
    mainTitle: string;
    subTitle: string;
    price: number;
    mrp: number;
    discount: number;
    image_url: string;
    product1Id: number;
    product2Id: number;
    product1_name?: string;
    product2_name?: string;
    rating?: number;
    reviews?: number;
    isActive: boolean;
}

export default function AdminCombos() {
    const [combos, setCombos] = useState<Combo[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        mainTitle: '',
        subTitle: '',
        price: '',
        mrp: '',
        product1Id: '',
        product2Id: '',
        isActive: true,
        rating: '',
        reviews: '',
        image: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchCombos();
        fetchProducts();
    }, []);

    const fetchCombos = async () => {
        try {
            const response = await axios.get('/combo-orders');
            setCombos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching combos:', error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if combo limit is reached
        if (combos.length >= 15) {
            alert('Combo limit reached! You can only add up to 15 combo products.');
            return;
        }

        if (!formData.name || !formData.price || !formData.product1Id || !formData.product2Id) {
            alert('Please fill in all required fields');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('mainTitle', formData.mainTitle);
        data.append('subTitle', formData.subTitle);
        data.append('price', formData.price);
        data.append('mrp', formData.mrp);
        data.append('product1Id', formData.product1Id);
        data.append('product2Id', formData.product2Id);
        data.append('isActive', String(formData.isActive));
        data.append('rating', formData.rating || '0');
        data.append('reviews', formData.reviews || '0');
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await axios.post('/combo-orders', data);
            alert('Combo added successfully');
            fetchCombos();
            setFormData({
                name: '',
                mainTitle: '',
                subTitle: '',
                price: '',
                mrp: '',
                product1Id: '',
                product2Id: '',
                isActive: true,
                rating: '',
                reviews: '',
                image: null
            });
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error adding combo:', error);
            alert('Failed to add combo');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this combo?')) return;

        try {
            await axios.delete(`/combo-orders?id=${id}`);
            setCombos(combos.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting combo:', error);
            alert('Failed to delete combo');
        }
    };

    return (
        <div className="fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Combo Orders Management</h1>
                    <p className={styles.subtitle}>Create and manage special combo offers</p>
                </div>
                <div>
                    <span className={`badge ${combos.length >= 15 ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                        {combos.length} / 15 Combos
                    </span>
                </div>
            </div>

            <div className="row">
                {/* Form Section */}
                <div className="col-lg-4 mb-4">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Create New Combo</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className={styles.label}>Combo Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="Name"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className={styles.label}>Main Title</label>
                                    <input
                                        type="text"
                                        name="mainTitle"
                                        value={formData.mainTitle}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="Title"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className={styles.label}>Sub Title</label>
                                    <input
                                        type="text"
                                        name="subTitle"
                                        value={formData.subTitle}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="Subtitle"
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className={styles.label}>Price (₹)</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className={styles.label}>MRP (₹)</label>
                                        <input
                                            type="number"
                                            name="mrp"
                                            value={formData.mrp}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className={styles.label}>Product 1</label>
                                    <select
                                        name="product1Id"
                                        value={formData.product1Id}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">Select First Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className={styles.label}>Product 2</label>
                                    <select
                                        name="product2Id"
                                        value={formData.product2Id}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                        required
                                    >
                                        <option value="">Select Second Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className={styles.label}>Rating (0-5)</label>
                                        <input
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="4.5"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className={styles.label}>Reviews Count</label>
                                        <input
                                            type="number"
                                            name="reviews"
                                            value={formData.reviews}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="10"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className={styles.label}>Combo Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="form-control"
                                    />
                                </div>

                                <button type="submit" className={styles.button} style={{ width: '100%' }}>
                                    Create Combo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="col-lg-8">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Active Combos</div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>
                                <div className="row">
                                    <div className="col-2">Image</div>
                                    <div className="col-4">Combo Details</div>
                                    <div className="col-3">Price Info</div>
                                    <div className="col-3 text-end">Action</div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-4 text-center">Loading...</div>
                            ) : combos.length === 0 ? (
                                <div className="p-4 text-center text-muted">No combo orders found. Create one above!</div>
                            ) : (
                                combos.map((combo) => (
                                    <div key={combo.id} className={styles.tableRow}>
                                        <div className="row w-100 align-items-center m-0">
                                            <div className="col-2">
                                                <div style={{ width: '50px', height: '50px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <Image
                                                        src={combo.image_url || '/placeholder.jpg'}
                                                        alt={combo.name}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="fw-bold text-dark">{combo.name}</div>
                                                <div className="small text-muted">{combo.product1_name} + {combo.product2_name}</div>
                                                <span className="badge bg-success bg-opacity-10 text-success border border-success mt-1">
                                                    {combo.discount}% OFF
                                                </span>
                                            </div>
                                            <div className="col-3">
                                                <div className="fw-bold">₹{combo.price}</div>
                                                {combo.mrp > combo.price && (
                                                    <div className="small text-decoration-line-through text-muted">₹{combo.mrp}</div>
                                                )}
                                            </div>
                                            <div className="col-3 text-end">
                                                <button
                                                    onClick={() => handleDelete(combo.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
