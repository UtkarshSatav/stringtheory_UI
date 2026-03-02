import React, { useEffect, useState } from 'react';
import { formApi } from '../../../api';

const AdminForms = () => {
    const [subTab, setSubTab] = useState('contact'); // 'contact' or 'newsletter'
    const [inquiries, setInquiries] = useState([]);
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (subTab === 'contact') fetchInquiries();
        else fetchNewsletters();
    }, [subTab]);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await formApi.getContactInquiries();
            setInquiries(res.data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await formApi.getNewsletters();
            setNewsletters(res.data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div>
            <div className="admin-header-row">
                <h2>Forms & Submissions</h2>
                <div className="sub-tabs">
                    <button className={subTab === 'contact' ? 'active-sub' : ''} onClick={() => setSubTab('contact')}>Contact Inquiries</button>
                    <button className={subTab === 'newsletter' ? 'active-sub' : ''} onClick={() => setSubTab('newsletter')}>Newsletter Subs</button>
                </div>
            </div>

            {loading ? <p>Loading Data...</p> : (
                <table className="admin-table">
                    {subTab === 'contact' ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {newsletters.map(item => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.subscribedAt?._seconds * 1000 || Date.now()).toLocaleDateString()}</td>
                                        <td>{item.email}</td>
                                    </tr>
                                ))}
                                {newsletters.length === 0 && <tr><td colSpan="2" style={{ textAlign: 'center' }}>No subscribers found.</td></tr>}
                            </tbody>
                        </>
                    )}
                </table>
            )}
        </div>
    );
};

export default AdminForms;
