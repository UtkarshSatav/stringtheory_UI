import React, { useEffect, useState } from 'react';
import { formApi } from '../../../api';

const AdminForms = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await formApi.getContactInquiries();
            setInquiries(res.data || []);
        } catch (e) {
            console.error('Error fetching inquiries:', e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    return (
        <div>
            <div className="admin-header-row">
                <h2>Contact Inquiries</h2>
            </div>

            {loading ? <p>Loading Data...</p> : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.map(item => (
                            <tr key={item.id}>
                                <td>{new Date(item.createdAt?._seconds * 1000 || Date.now()).toLocaleDateString()}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td><b>{item.subject}</b></td>
                                <td>{item.message}</td>
                            </tr>
                        ))}
                        {inquiries.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center' }}>No inquiries found.</td></tr>}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminForms;
