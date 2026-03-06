import React, { useEffect, useState } from 'react';
import { customerApi } from '../../../api';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerApi.getAllCustomers();
            setCustomers(res.data || []);
        } catch (e) {
            console.error('Error fetching customers:', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery)
    );

    return (
        <div>
            <div className="admin-header-row">
                <h2>Manage Customers</h2>
                <div className="admin-actions">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="admin-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', marginRight: '10px' }}
                    />
                </div>
            </div>

            {loading ? <p>Loading Customers...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone || '—'}</td>
                                <td>
                                    <span className={`status-badge ${customer.role === 'admin' ? 'Paid' : 'Shipped'}`}>
                                        {customer.role || 'user'}
                                    </span>
                                </td>
                                <td>{customer.createdAt?._seconds ? new Date(customer.createdAt._seconds * 1000).toLocaleDateString() : '—'}</td>
                            </tr>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                    No customers found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminCustomers;
