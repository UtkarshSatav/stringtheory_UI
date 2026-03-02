import React, { useEffect, useState } from 'react';
import { productApi } from '../../../api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await productApi.getProducts();
            setProducts(res.data || []);
        } catch (e) { console.error('Error fetching products:', e); }
        setLoading(false);
    };

    const handleEdit = (prod) => {
        setFormData(prod);
        setIsEditing(true);
    };

    const handleCreateNew = () => {
        setFormData({
            title: '',
            category: 'Necklace',
            sku: '',
            price: 0,
            stockQuantity: 10,
            image: '',
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
        try {
            if (formData.id) {
                // Update
                const res = await productApi.updateProduct(formData.id, formData);
                if (res.success) {
                    setProducts(products.map(p => p.id === formData.id ? res.data : p));
                }
            } else {
                // Create
                const res = await productApi.createProduct(formData);
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
                {!isEditing && <button className="btn-add" onClick={handleCreateNew}>Add Product</button>}
            </div>

            {loading ? <p>Loading Products...</p> : isEditing ? (
                <div className="admin-form-container">
                    <h3>{formData.id ? 'Edit Product' : 'Create New Product'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
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
                            <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
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
                            <label>Image URL</label>
                            <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
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
                                <td><img src={prod.image} alt="product" style={{ width: '40px', borderRadius: '5px' }} /></td>
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
