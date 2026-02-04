'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from '@/app/admin/styles/admin.module.css';
import Cookies from 'js-cookie';

interface Product {
    id: number;
    name: string;
    mainTitle: string;
    subTitle: string;
    price: number;
    mrp: number;
    weight: string;
    category: string;
    image_url: string;
}

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        mainTitle: '',
        subTitle: '',
        price: '',
        mrp: '',
        weight: '',
        category: 'fruit-powder',
        rating: '',
        reviews: '',
        image: null as File | null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        // Check if product limit is reached
        if (products.length >= 15) {
            alert('Product limit reached! You can only add up to 15 products.');
            return;
        }

        if (!formData.name || !formData.price || !formData.image) {
            alert('Please fill in all required fields');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('mainTitle', formData.mainTitle);
        data.append('subTitle', formData.subTitle);
        data.append('price', formData.price);
        data.append('mrp', formData.mrp);
        data.append('weight', formData.weight);
        data.append('category', formData.category);
        data.append('rating', formData.rating || '0');
        data.append('reviews', formData.reviews || '0');
        data.append('image', formData.image);

        try {
            await axios.post('/api/products', data);
            alert('Product added successfully');
            fetchProducts();
            setFormData({
                name: '',
                mainTitle: '',
                subTitle: '',
                price: '',
                mrp: '',
                weight: '',
                category: 'fruit-powder',
                rating: '',
                reviews: '',
                image: null
            });
            setPreviewUrl(null);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/products?id=${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    return (
        <div className="fade-in">
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Product Management</h1>
                    <p className={styles.subtitle}>Add and manage your store products</p>
                </div>
                <div>
                    <span className={`badge ${products.length >= 15 ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                        {products.length} / 15 Products
                    </span>
                </div>
            </div>

            <div className="row">
                {/* Form Section */}
                <div className="col-lg-4 mb-4">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Add New Product</h2>
                        </div>
                        <div className={styles.cardBody}>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className={styles.label}>Product Name</label>
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
                                    <label className={styles.label}>Weight</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        className={styles.input}
                                        placeholder="e.g. 100g"
                                    />
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

                                <div className="mb-3">
                                    <label className={styles.label}>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                    >
                                        <option value="fruit-powder">Fruit Powder</option>
                                        <option value="vegetable-powder">Vegetable Powder</option>
                                        <option value="spices">Spices</option>
                                        <option value="namkeen">Namkeen</option>
                                        <option value="combo">Combo</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className={styles.label}>Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <button type="submit" className={styles.button} style={{ width: '100%' }}>
                                    Add Product
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="col-lg-8">
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Product List</div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>
                                <div className="row">
                                    <div className="col-2">Image</div>
                                    <div className="col-4">Product Details</div>
                                    <div className="col-3">Price Info</div>
                                    <div className="col-3 text-end">Action</div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="p-4 text-center">Loading...</div>
                            ) : products.length === 0 ? (
                                <div className="p-4 text-center text-muted">No products found.</div>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className={styles.tableRow}>
                                        <div className="row w-100 align-items-center m-0">
                                            <div className="col-2">
                                                <div style={{ width: '50px', height: '50px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <Image
                                                        src={product.image_url || '/placeholder.jpg'}
                                                        alt={product.name}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="fw-bold text-dark">{product.name}</div>
                                                <div className="small text-muted">{product.category}</div>
                                                <div className="small text-muted">{product.weight}</div>
                                            </div>
                                            <div className="col-3">
                                                <div className="fw-bold">₹{product.price}</div>
                                                {product.mrp && product.mrp > product.price && (
                                                    <div className="small text-decoration-line-through text-muted">₹{product.mrp}</div>
                                                )}
                                            </div>
                                            <div className="col-3 text-end">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
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
