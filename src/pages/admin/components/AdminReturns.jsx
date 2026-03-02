import React, { useEffect, useState } from 'react';
import { returnApi } from '../../../api';

const AdminReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadReturns = async () => {
        setLoading(true);
        try {
            const res = await returnApi.getReturns();
            setReturns(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load return requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReturns();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await returnApi.updateStatus(id, newStatus);
            // Optimistic update
            setReturns(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
    };

    const formatDate = (ts) => {
        if (!ts) return '—';
        const date = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
        return date.toLocaleDateString();
    };

    return (
        <div className="admin-section">
            <div className="admin-header-row">
                <h2>Return Requests</h2>
            </div>

            {error && <p style={{ color: '#e74c3c' }}>{error}</p>}

            {loading ? (
                <p>Loading returns...</p>
            ) : returns.length === 0 ? (
                <p>No return requests found.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Order ID</th>
                            <th>Email</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map(req => (
                            <tr key={req.id}>
                                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{req.id.slice(-6).toUpperCase()}</td>
                                <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>{req.orderId}</td>
                                <td>{req.customerEmail}</td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {req.reason}
                                </td>
                                <td>
                                    <span className={`status-badge ${req.status}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>{formatDate(req.createdAt)}</td>
                                <td>
                                    <select
                                        value={req.status}
                                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminReturns;
