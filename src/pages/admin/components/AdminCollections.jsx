import React, { useEffect, useState } from 'react';
import { collectionApi } from '../../../api';

const AdminCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', slug: '', active: true });

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await collectionApi.getCollections();
            setCollections(res.data || []);
        } catch (e) {
            console.error('Error fetching collections:', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await collectionApi.createCollection(formData);
            if (res.success) {
                setCollections([...collections, res.data]);
                setIsCreating(false);
            }
        } catch (e) {
            console.error('Failed to create collection', e);
            alert("Failed to create collection.");
        }
    };

    if (loading) return <p>Loading Collections...</p>;

    return (
        <div>
            <div className="admin-header-row">
                <h2>Manage Collections</h2>
                {!isCreating && <button className="btn-add" onClick={() => setIsCreating(true)}>Add Collection</button>}
            </div>

            {isCreating ? (
                <div className="admin-form-container">
                    <h3>Create New Collection</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Collection Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL Friendly)</label>
                            <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="3"></textarea>
                        </div>
                        <div className="admin-form-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsCreating(false)}>Cancel</button>
                            <button type="submit" className="btn-save">Save Collection</button>
                        </div>
                    </form>
                </div>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Products Count</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.map(col => (
                            <tr key={col.id}>
                                <td>{col.name}</td>
                                <td>/{col.slug}</td>
                                <td>{col.products?.length || 0}</td>
                                <td><span className={`status-badge ${col.active ? 'Paid' : 'Cancelled'}`}>{col.active ? 'Active' : 'Inactive'}</span></td>
                            </tr>
                        ))}
                        {collections.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No collections found.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminCollections;
