import React, { useEffect, useState } from 'react';
import { productApi } from '../../../api';
import ImageUpload from './ImageUpload';
import BulkUpload from './BulkUpload';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isBulkUploading, setIsBulkUploading] = useState(false);
    const [formData, setFormData] = useState(null);

    const onImageUpload = (url) => {
        setFormData({ ...formData, images: [url] });
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productApi.getProducts();
            setProducts(res.data || []);
        } catch (e) {
            console.error('Error fetching products:', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (prod) => {
        setFormData({
            ...prod,
            images: prod.images || (prod.image ? [prod.image] : [])
        });
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setFormData({
            title: '',
            slug: '',
            description: '',
            category: 'Necklace',
            sku: '',
            price: 0,
            stockQuantity: 10,
            images: [],
            active: true
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await productApi.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (e) {
            console.error('Failed to delete', e);
            alert("Failed to delete product.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = { ...formData };
        if (!finalData.slug) {
            finalData.slug = finalData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        try {
            if (formData.id) {
                const res = await productApi.updateProduct(formData.id, finalData);
                if (res.success) {
                    setProducts(products.map(p => p.id === formData.id ? { ...finalData } : p));
                }
            } else {
                const res = await productApi.createProduct(finalData);
                if (res.success) {
                    setProducts([...products, res.data]);
                }
            }
            setIsEditing(false);
        } catch (e) {
            console.error('Failed to save product', e);
            alert("Failed to save product.");
        }
    };

    return (
        <div>
            <div className="admin-header-row">
                <h2>Manage Products</h2>
                <div className="admin-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => { setIsBulkUploading(!isBulkUploading); setIsEditing(false); }}
                    >
                        {isBulkUploading ? 'Back to List' : 'Bulk Upload'}
                    </button>
                    {!isEditing && !isBulkUploading && <button className="btn-add" onClick={handleCreateNew}>Add Product</button>}
                </div>
            </div>

            {isBulkUploading ? (
                <BulkUpload onComplete={fetchProducts} />
            ) : loading ? <p>Loading Products...</p> : isEditing ? (
                <div className="admin-form-container">
                    <h3>{formData.id ? 'Edit Product' : 'Create New Product'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Product Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Cream Fancy Shell Necklace" required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    <option value="Necklace">Necklace</option>
                                    <option value="Bracelet">Bracelet</option>
                                    <option value="Choker">Choker</option>
                                    <option value="Earring">Earring</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>SKU</label>
                                <input type="text" value={formData.sku || ''} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="SKU001" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                placeholder="Describe the product details..."
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input type="number" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: Number(e.target.value) })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Product Image</label>
                            <ImageUpload
                                onUploadSuccess={onImageUpload}
                                currentImage={formData.images?.[0] || formData.image}
                            />
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-save">Save Product</button>
                        </div>
                    </form>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(prod => (
                            <tr key={prod.id}>
                                <td>
                                    <img
                                        src={prod.images?.[0] || prod.image || 'https://via.placeholder.com/40'}
                                        alt="product"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                </td>
                                <td>{prod.title}</td>
                                <td>{prod.category}</td>
                                <td>₹{prod.price}</td>
                                <td>{prod.stockQuantity}</td>
                                <td>
                                    <button className="btn-action edit" onClick={() => handleEdit(prod)}>Edit</button>
                                    <button className="btn-action delete" onClick={() => handleDelete(prod.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No products found.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminProducts;
