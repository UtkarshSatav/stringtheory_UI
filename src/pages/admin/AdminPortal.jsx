import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminCollections from './components/AdminCollections';
import AdminForms from './components/AdminForms';
import AdminReturns from './components/AdminReturns';

import './AdminPortal.css';

const AdminPortal = () => {
    const { currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        // Enforce admin login
        if (!currentUser || !isAdmin) {
            navigate('/profile');
            return;
        }
    }, [currentUser, isAdmin, navigate]);

    return (
        <div className="admin-portal-container">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                    <p>{currentUser?.email}</p>
                </div>
                <ul>
                    <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</li>
                    <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</li>
                    <li className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>Collections</li>
                    <li className={activeTab === 'returns' ? 'active' : ''} onClick={() => setActiveTab('returns')}>Returns & Refunds</li>
                    <li className={activeTab === 'forms' ? 'active' : ''} onClick={() => setActiveTab('forms')}>Forms & Inquiries</li>
                </ul>
            </div>
            <div className="admin-content">
                {activeTab === 'orders' && <AdminOrders />}
                {activeTab === 'products' && <AdminProducts />}
                {activeTab === 'collections' && <AdminCollections />}
                {activeTab === 'returns' && <AdminReturns />}
                {activeTab === 'forms' && <AdminForms />}
            </div>
        </div>
    );
};

export default AdminPortal;
